#!/bin/sh
# BOH wardrobe fit, Package 1 + 1b: the whole build, in order. Created for Assunta Scotto, creator and owner of BOH. 2026-11-14.
# Run from a clean copy of main 243b02e:  sh tools/wardrobe/build.sh .     (about 20 minutes; the outfit rebuild is the slow step)
set -e
R=${1:-.}; T=$R/tools/wardrobe
python3 -I $T/bodyparts.py $R $T/parts && rm -f $T/parts/_parts_preview.jpg
python3 -I $T/fix_hats.py $R
python3 -I $T/fix_sandals.py $R
python3 -I $T/refit.py $R
python3 -I $T/make_masks.py $R $T/parts
python3 -I $T/fitrules.py $R $T/parts
python3 -I $T/package1.py $R && rm -f $T/.cache_sprWear_*
python3 -I $T/test_wardrobe.py $R
python3 $T/refund_test.py $R
python3 -I $T/mentions.py $R
python3 -I $T/fingerprint.py $R > $T/fingerprint.now.txt
diff $T/EXPECTED.txt $T/fingerprint.now.txt && echo "FINGERPRINTS MATCH" || echo "FINGERPRINTS DIFFER: compare tools/wardrobe/fit.json with fit.expected.json"
