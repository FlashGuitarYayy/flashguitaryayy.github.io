"""把每首歌 PDF 的第一页渲染成默认封面：assets/covers/<id>.jpg

用法（在项目根目录执行）：
    python tools/make_covers.py            # 只生成还没有封面的歌
    python tools/make_covers.py --force    # 全部重新生成

<id> 就是 scores/ 下的文件夹名。已经存在的封面不会被覆盖（除非加 --force），
所以你随时可以把自己喜欢的专辑封面另存为 assets/covers/<id>.jpg 替换掉。
每个文件夹里按文件名排序取最后一个 PDF（通常文件名里带日期，最后一个就是最新的）。

依赖：pip install pymupdf
"""
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parent.parent
SCORES = ROOT / "scores"
COVERS = ROOT / "assets" / "covers"
ZOOM = 2.0          # A4 宽 595pt -> 约 1190px
JPEG_QUALITY = 82


def main():
    force = "--force" in sys.argv
    COVERS.mkdir(parents=True, exist_ok=True)
    for folder in sorted(p for p in SCORES.iterdir() if p.is_dir()):
        out = COVERS / f"{folder.name}.jpg"
        if out.exists() and not force:
            print(f"skip    {out.relative_to(ROOT)}  (已存在)")
            continue
        pdfs = sorted(folder.glob("*.pdf"))
        if not pdfs:
            print(f"skip    {folder.name}  (没有 PDF)")
            continue
        src = pdfs[-1]
        doc = pymupdf.open(src)
        pix = doc[0].get_pixmap(matrix=pymupdf.Matrix(ZOOM, ZOOM), alpha=False)
        pix.save(out, jpg_quality=JPEG_QUALITY)
        print(f"render  {out.relative_to(ROOT)}  {pix.width}x{pix.height}  <- {src.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
