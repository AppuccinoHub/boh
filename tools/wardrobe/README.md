# BOH wardrobe tools (Package 1 + 1b)
Created for Assunta Scotto, creator and owner of BOH. 2026-11-14. Base: main 243b02e.

What the package does, in every level (italiano1, italiano2, italiano3, italiano4, ap) and on the front page:
- Boh's own neck, hands and hijab are drawn above outfits, so outfits look worn, not stuck on.
- Hair is tucked inside every hat (the hair line follows the hat's edge); hat brims end just above the eyes.
- Boh's painted-on clothes are hidden under outfits, long pants, long skirts and sandals.
- Outfits that were cut off at the doll frame are rebuilt uncut (assets/boutique/p/x).
- Team and school content removed with automatic Boh Cashi refunds; Look Firenze pulled (420 BC refund).
- Practice sentences: the town is Roma; Sara is italiana.

Run `sh tools/wardrobe/build.sh .` from a clean copy of main. Every step starts from the committed files, so it is safe to run twice.
Files: dolllib.py (doll compositor), bodyparts.py (splits Boh into parts), fix_hats.py, fix_sandals.py, refit.py (uncut outfits),
make_masks.py, fitrules.py (writes fit.json), package1.py (the patcher), test_wardrobe.py (506 checks), refund_test.py and
bohrender.py / beforeafter.py (real pages in headless Chrome), mentions.py, fingerprint.py, EXPECTED.txt, fit.expected.json.
