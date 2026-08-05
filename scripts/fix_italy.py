import json, re, copy

PATH = '/workspace/tno-strategy-game/data/svg_maps/triumvirate.json'

with open(PATH) as f:
    data = json.load(f)

def path_bounds(p):
    pts = re.findall(r'[ML]?\s*(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)', p)
    xs, ys = [], []
    for x, y in pts:
        xs.append(float(x)); ys.append(float(y))
    if not xs: return None
    return min(xs), max(xs), min(ys), max(ys)

countries = data['countries']

# Fix Italy: keep only mainland paths (roughly x:230-430, y:40-155)
# Remove giant combined paths (idx 0, 43, 47, 93, 97), East Africa paths (41,42,46,91,92,96)
# Keep paths whose bbox is mostly within mainland bbox
italy = countries['italy']
paths = italy['p']

keep = []
removed = []
for i, p in enumerate(paths):
    b = path_bounds(p)
    if b is None:
        continue
    mnx, mxx, mny, mxy = b
    # Mainland bounds: x in [230, 430], y in [40, 155]
    # Path is considered mainland if its entire bbox lies within these bounds
    if mnx >= 230 and mxx <= 430 and mny >= 40 and mxy <= 155:
        keep.append(p)
    else:
        removed.append((i, mnx, mxx, mny, mxy))

print(f"Italy: kept {len(keep)} paths, removed {len(removed)} paths")
for r in removed:
    print(f"  removed idx={r[0]} x=[{r[1]:.1f},{r[2]:.1f}] y=[{r[3]:.1f},{r[4]:.1f}]")

# Update
countries['italy']['p'] = keep
countries['italy']['n'] = len(keep)

# Also fix italian_east_africa: remove the giant combined paths (bbox x > 1000 or x<-500)
iea = countries.get('italian_east_africa')
if iea:
    keep_iea = []
    for p in iea['p']:
        b = path_bounds(p)
        if b is None:
            continue
        mnx, mxx, mny, mxy = b
        # Remove giant combined paths (span whole map)
        if mxx > 1000 or mnx < -100:
            print(f"  italian_east_africa removed giant x=[{mnx:.1f},{mxx:.1f}] y=[{mny:.1f},{mxy:.1f}]")
        else:
            keep_iea.append(p)
    countries['italian_east_africa']['p'] = keep_iea
    countries['italian_east_africa']['n'] = len(keep_iea)

# Fix algeria: remove paths that match italy's removed giant paths (129-279 x 135-313)
alg = countries.get('algeria')
if alg:
    keep_alg = []
    for p in alg['p']:
        b = path_bounds(p)
        if b is None:
            continue
        mnx, mxx, mny, mxy = b
        # Algeria proper: x in [80, 230], y in [130, 260]
        if mnx >= 80 and mxx <= 230 and mny >= 130 and mxy <= 260:
            keep_alg.append(p)
        else:
            print(f"  algeria removed x=[{mnx:.1f},{mxx:.1f}] y=[{mny:.1f},{mxy:.1f}]")
    countries['algeria']['p'] = keep_alg
    countries['algeria']['n'] = len(keep_alg)

# Write back
with open(PATH, 'w') as f:
    json.dump(data, f, ensure_ascii=False)

print("\nDone.")
