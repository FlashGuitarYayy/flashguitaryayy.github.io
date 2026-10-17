"""把一张纯色底的图片做成网站图标。

用法（在项目根目录执行）：
    python tools/make_icon.py 图片.png
    python tools/make_icon.py 图片.png --crop 345,185,960,860 --flush-bottom

参数：
  --crop x0,y0,x1,y1  先裁出原图里的这一块再处理（像素坐标），用来只取头和上半身，
                      或者避开画面里的草、地面等装饰
  --flush-bottom      主体底边贴住图标下沿（配合 --crop 从身体中间截断时用，看起来像从下面探出来）
  --tol N             和背景色的距离在 N 以内算背景，默认 40

做的事：
  1. 去掉和画面边缘相连的背景：和边缘颜色相近的像素，以及浅灰色的投影
  2. 只保留最大的一块主体（去掉零散的草、花、碎点）
  3. 裁到主体、补成正方形，输出：
       favicon.ico                 浏览器标签页图标（16/32/48）
       assets/icon-192.png         透明背景，现代浏览器 / 安卓
       assets/icon-512.png         透明背景的大图，留作母版
       assets/apple-touch-icon.png iPhone「添加到主屏幕」用，带米色底

依赖：pip install pillow numpy
"""
import argparse
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SAT_MAX = 24        # 低于这个饱和度（max-min）算「灰色」，用来连投影一起去掉
VAL_MIN = 120       # 高于这个亮度的灰色才可能是背景 / 投影（黑色、深灰的细节不会被删）
MARGIN = 0.04       # 正方形四周留白比例
PAPER = (244, 239, 230)  # apple-touch-icon 的底色，和网页浅色背景一致

N4 = ((-1, 0), (1, 0), (0, -1), (0, 1))


def flood_from_border(cand: np.ndarray) -> np.ndarray:
    """从图片边缘出发，标出和边缘连通的 cand 区域。"""
    h, w = cand.shape
    out = np.zeros_like(cand)
    q = deque()
    edge = [(y, x) for y in range(h) for x in (0, w - 1)] + [(y, x) for x in range(w) for y in (0, h - 1)]
    for y, x in edge:
        if cand[y, x] and not out[y, x]:
            out[y, x] = True
            q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in N4:
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and cand[ny, nx] and not out[ny, nx]:
                out[ny, nx] = True
                q.append((ny, nx))
    return out


def largest_component(fg: np.ndarray) -> np.ndarray:
    """只保留面积最大的一块前景。"""
    h, w = fg.shape
    seen = np.zeros_like(fg)
    best = []
    for sy, sx in zip(*np.nonzero(fg)):
        if seen[sy, sx]:
            continue
        seen[sy, sx] = True
        q = deque([(sy, sx)])
        pixels = []
        while q:
            y, x = q.popleft()
            pixels.append((y, x))
            for dy, dx in N4:
                ny, nx = y + dy, x + dx
                if 0 <= ny < h and 0 <= nx < w and fg[ny, nx] and not seen[ny, nx]:
                    seen[ny, nx] = True
                    q.append((ny, nx))
        if len(pixels) > len(best):
            best = pixels
    keep = np.zeros_like(fg)
    if best:
        ys, xs = zip(*best)
        keep[list(ys), list(xs)] = True
    return keep


def subject_mask(rgb: np.ndarray, tol: float) -> np.ndarray:
    a = rgb.astype(int)
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    bg_color = np.median(border, axis=0)
    near_bg = np.sqrt(((a - bg_color) ** 2).sum(axis=2)) <= tol
    mx, mn = a.max(axis=2), a.min(axis=2)
    light_grey = ((mx - mn) <= SAT_MAX) & (mx >= VAL_MIN)
    background = flood_from_border(near_bg | light_grey)
    return largest_component(~background)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("image")
    ap.add_argument("--crop", help="x0,y0,x1,y1")
    ap.add_argument("--flush-bottom", action="store_true")
    ap.add_argument("--tol", type=float, default=40)
    args = ap.parse_args()

    src = Image.open(args.image).convert("RGB")
    if args.crop:
        src = src.crop(tuple(int(v) for v in args.crop.split(",")))
    keep = subject_mask(np.asarray(src), args.tol)

    alpha = Image.fromarray(np.where(keep, 255, 0).astype(np.uint8))
    # 边缘往里收 1px 再羽化，去掉抠图边上的杂色
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
    rgba = src.copy()
    rgba.putalpha(alpha)

    # 裁到主体，补成正方形
    l, t, r, b = alpha.point(lambda v: 255 if v > 8 else 0).getbbox()
    if args.flush_bottom:
        b = src.height  # 截断的底边保持笔直，贴住图标下沿
    subject = rgba.crop((l, t, r, b))
    side = int(max(subject.size) * (1 + 2 * MARGIN))
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    x = (side - subject.width) // 2
    y = side - subject.height if args.flush_bottom else (side - subject.height) // 2
    square.paste(subject, (x, y), subject)

    assets = ROOT / "assets"
    assets.mkdir(exist_ok=True)

    def sized(n):
        return square.resize((n, n), Image.LANCZOS)

    sized(512).save(assets / "icon-512.png", optimize=True)
    sized(192).save(assets / "icon-192.png", optimize=True)

    # iPhone 会把图标裁成圆角，主体缩小一点留出边距；贴底时底边不留白
    touch = Image.new("RGBA", (180, 180), PAPER + (255,))
    inner = sized(156)
    touch.alpha_composite(inner, (12, 180 - 156 if args.flush_bottom else 12))
    touch.convert("RGB").save(assets / "apple-touch-icon.png", optimize=True)

    sized(256).save(ROOT / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

    for p in ["favicon.ico", "assets/icon-192.png", "assets/icon-512.png", "assets/apple-touch-icon.png"]:
        print(f"wrote {p}  ({(ROOT / p).stat().st_size} bytes)")


if __name__ == "__main__":
    main()
