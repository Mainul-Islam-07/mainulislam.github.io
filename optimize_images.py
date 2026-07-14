#!/usr/bin/env python3
"""Optimize project/gallery images IN PLACE for fast web loading.

- Backs up each original to data/_originals/<same path> (once), then always
  re-encodes FROM that pristine backup, so re-runs are idempotent and lossless.
- Resizes so the long edge is <= MAX_EDGE, strips EXIF (after applying rotation),
  and re-saves compressed. Filenames/extensions are preserved, so profile.json
  paths keep working with no code changes.

Run:  python optimize_images.py          (optimize)
      python optimize_images.py --dry     (report only, no writes)
"""
import os
import sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC_DIRS = [os.path.join("data", "Projects"), os.path.join("data", "Gallery")]
BACKUP_DIR = os.path.join("data", "_originals")
EXT = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
MAX_EDGE = 1600
JPEG_QUALITY = 82
DRY = "--dry" in sys.argv


def optimize(path, rel):
    backup = os.path.join(ROOT, BACKUP_DIR, rel)
    # Back up the pristine original once.
    if not os.path.exists(backup):
        if not DRY:
            os.makedirs(os.path.dirname(backup), exist_ok=True)
            with open(path, "rb") as a, open(backup, "wb") as b:
                b.write(a.read())
    source = backup if os.path.exists(backup) else path

    before = os.path.getsize(path)
    try:
        im = Image.open(source)
        im = ImageOps.exif_transpose(im)  # bake in rotation
        fmt = (im.format or "").upper()
        ext = os.path.splitext(path)[1].lower()

        w, h = im.size
        scale = min(1.0, MAX_EDGE / max(w, h))
        if scale < 1.0:
            im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

        if DRY:
            return before, None

        if ext in (".jpg", ".jpeg") or fmt == "JPEG":
            if im.mode in ("RGBA", "P", "LA"):
                im = im.convert("RGB")
            im.save(path, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)
        elif ext == ".png" or fmt == "PNG":
            im.save(path, "PNG", optimize=True)
        elif ext == ".webp" or fmt == "WEBP":
            im.save(path, "WEBP", quality=JPEG_QUALITY, method=6)
        else:
            im.save(path)
        return before, os.path.getsize(path)
    except Exception as e:
        print(f"  !! skipped (error): {rel} -> {e}")
        return before, before


def main():
    total_before = total_after = 0
    changed = 0
    rows = []
    for d in SRC_DIRS:
        base = os.path.join(ROOT, d)
        if not os.path.isdir(base):
            continue
        for dp, dn, fn in os.walk(base):
            if os.sep + "_originals" + os.sep in dp + os.sep:
                continue
            for f in fn:
                if os.path.splitext(f)[1].lower() not in EXT:
                    continue
                full = os.path.join(dp, f)
                rel = os.path.relpath(full, os.path.join(ROOT, "data"))
                before, after = optimize(full, rel)
                total_before += before
                if after is not None:
                    total_after += after
                    if after < before * 0.98:
                        changed += 1
                        rows.append((before, after, os.path.relpath(full, ROOT)))

    rows.sort(reverse=True)
    for before, after, name in rows[:20]:
        print(f"  {before/1_048_576:5.2f} MB -> {after/1024:6.0f} KB   {name}")
    print("-" * 60)
    if DRY:
        print(f"[dry] {total_before/1_048_576:.1f} MB across images (no changes written)")
    else:
        print(f"optimized {changed} image(s): "
              f"{total_before/1_048_576:.1f} MB -> {total_after/1_048_576:.1f} MB "
              f"({100*(1-total_after/max(total_before,1)):.0f}% smaller)")
        print(f"originals backed up under {BACKUP_DIR}/")


if __name__ == "__main__":
    main()
