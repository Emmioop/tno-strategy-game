import xml.etree.ElementTree as ET
import json
import re
import os
import sys

SVG_NS = 'http://www.w3.org/2000/svg'
SVG_DIR = 'map_source/TNO maps - Vectorized by lilauid/svg maps'
OUTPUT_DIR = 'data/svg_maps'

CN_TO_ID = {
    '聯合王國': 'england', '愛爾蘭': 'ireland', '大日耳曼國': 'germany',
    '挪威條約港': 'norway_treaty_port', '克里米亞': 'crimea',
    '尼德蘭總督轄區': 'netherlands_governorate', '尼德蘭總督區': 'netherlands_governorate',
    '黨衛軍勃艮第騎士團國': 'burgundy', '法蘭西國': 'france',
    '丹麥': 'denmark', '挪威總督轄區': 'norway_governorate',
    '斯洛伐克': 'slovakia', '匈牙利': 'hungary', '羅馬尼亞': 'romania',
    '塞爾維亞': 'serbia', '保加利亞': 'bulgaria',
    '烏克蘭專員轄區': 'ukraine_kommissariat', '東方專員轄區': 'ost_kommissariat',
    '莫斯科專員轄區': 'moscow_kommissariat', '高加索專員轄區': 'caucasus_kommissariat',
    '本土': 'homeland', '海外領土': 'overseas', '海峽群島': 'channel_islands',
    '總督府': 'governorate',
    '美國': 'usa', '加拿大': 'canada', '墨西哥': 'mexico',
    '巴西': 'brazil', '阿根廷': 'argentina', '智利': 'chile',
    '秘魯': 'peru', '哥倫比亞': 'colombia', '委內瑞拉': 'venezuela',
    '厄瓜多爾': 'ecuador', '玻利維亞': 'bolivia', '巴拉圭': 'paraguay',
    '烏拉圭': 'uruguay', '古巴': 'cuba', '海地': 'haiti',
    '多米尼加': 'dominican', '巴拿馬': 'panama', '哥斯大黎加': 'costarica',
    '尼加拉瓜': 'nicaragua', '洪都拉斯': 'honduras', '危地馬拉': 'guatemala',
    '圭亞那': 'guyana', '圭亞那-卡宴': 'french_guiana', '新格拉納達': 'new_granada',
    '共和國': 'republic',
    '日本': 'japan', '滿洲國': 'manchuria', '中華民國': 'roc',
    '廣東國': 'guangdong', '廣西省': 'guangxi', '貴州省': 'guizhou',
    '晉綏行政公署': 'jinsui', '蒙疆聯合自治政府': 'mengjiang',
    '西北方面軍': 'northwest_frontier', '泰國': 'thailand', '越南': 'vietnam',
    '柬埔寨': 'cambodia', '寮國': 'laos', '緬甸': 'burma',
    '印度尼西亞': 'indonesia', '菲律賓': 'philippines', '自由印度': 'free_india',
    '印度共和國': 'india', '印度': 'india', '尼泊爾': 'nepal',
    '不丹自治省': 'bhutan', '海外島嶼': 'overseas_islands',
    '南洋軍政監': 'south_sea_administration', '爭議地區': 'disputed',
    '哈薩克': 'kazakhstan', '烏茲別克': 'uzbekistan',
    '土庫曼': 'turkmenistan', '吉爾吉斯': 'kyrgyzstan',
    '塔吉克': 'tajikistan', '卡拉卡爾帕克': 'karakalpakstan',
    '巴什科爾托': 'bashkortostan', '韃靼': 'tatarstan',
    '高爾基': 'gorky', '維亞特卡': 'vyatka', '科米': 'komi',
    '尤格拉': 'yugra', '沃洛格達': 'vologda', '奧涅加': 'onega',
    '奧倫堡': 'orenburg', '薩馬拉': 'samara', '馬格尼托格爾斯克': 'magnitogorsk',
    '茲拉特烏斯特': 'zlatooust', '迪勒萬格': 'dillinger',
    '聖格奧爾基': 'st_george', '烏拉爾聯盟': 'ural_union',
    '突厥斯坦軍團': 'turkestan_legion', '西俄羅斯革命陣線': 'west_russia_front',
    '雅利安兄弟會': 'aryan_brotherhood', '沃爾庫塔': 'vorkuta',
    '伊朗帝國': 'iran', '伊拉克': 'iraq', '敘利亞': 'syria',
    '沙烏地阿拉伯': 'saudi', '葉門': 'yemen', '阿曼': 'oman',
    '阿富汗': 'afghanistan', '斯里蘭卡': 'sri_lanka',
    '海灣總督領': 'gulf_governorate', '摩蘇爾和基爾庫克': 'mosul_kirkuk',
    '義大利': 'italy', '伊比利亞': 'iberia', '克羅地亞': 'croatia',
    '土耳其': 'turkey', '希臘': 'greece', '埃及': 'egypt',
    '阿爾及利亞': 'algeria', '義屬東非': 'italian_east_africa',
    '黎凡特': 'levant', '黑山': 'montenegro', '摩納哥': 'monaco',
    '聖馬利諾': 'san_marino',
    '剛果': 'congo', '東非': 'east_africa',
    '法屬馬達加斯加': 'french_madagascar', '西南非': 'southwest_africa',
    '加奈姆': 'kanem', '卡麥隆': 'cameroon', '埃爾': 'air',
    '幾內亞': 'guinea', '曼迪': 'mandi', '朱拉': 'jura',
    '格貝蘭': 'gberan', '沃洛菲亞': 'wolofia', '特拉札': 'taraza',
    '約魯巴蘭': 'yorubaland', '索克托': 'sokoto', '自由法國': 'free_france',
    '莫西蘭': 'mossiland', '迦納': 'ghana', '阿札瓦德': 'azawad',
    '馬里國': 'mali',
    '勃艮第南極': 'burgundy_antarctica', '新史瓦本': 'new_swabia',
    '日本南極': 'japan_antarctica', '智利南極': 'chile_antarctica',
    '阿根廷南極': 'argentina_antarctica', '澳大利亞': 'australia',
    '紐西蘭': 'new_zealand', '法國': 'france_metropolitan',
    '南非': 'south_africa', 'OFN託管地': 'ofn_trust_territory',
}

def strip_suffix(gid):
    return re.sub(r'_\d+$', '', gid)

def parse_svg_paths(raw_d):
    cmds = re.findall(r'[MmZzLlHhVvCcSsQqTtAa]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?', raw_d)
    return raw_d

def extract_paths(elem, ns):
    paths = []
    for p in elem.iter('{http://www.w3.org/2000/svg}path'):
        d = p.get('d', '')
        if d and len(d) > 10:
            paths.append(d)
    for p in elem.iter('{http://www.w3.org/2000/svg}polygon'):
        pts = p.get('points', '')
        if pts and len(pts) > 5:
            paths.append(f'M{pts}Z')
    for p in elem.iter('{http://www.w3.org/2000/svg}polyline'):
        pts = p.get('points', '')
        if pts and len(pts) > 5:
            paths.append(f'M{pts}')
    return paths

def get_various(elem, ns, tag, attr):
    results = []
    for el in elem.iter(f'{{{ns}}}{tag}'):
        v = el.get(attr, '')
        if v:
            results.append(v)
    return results

def collect_country_data(svg_path):
    tree = ET.parse(svg_path)
    root = tree.getroot()
    
    view_box = root.get('viewBox', '0 0 100 100')
    parts = view_box.split()
    view = {
        'x': float(parts[0]),
        'y': float(parts[1]),
        'w': float(parts[2]),
        'h': float(parts[3])
    }
    
    countries = {}
    
    def process_group(elem, path_depth=0):
        gid = elem.get('id', '')
        clean_gid = strip_suffix(gid)
        
        if path_depth == 0 and clean_gid in ('底色', '海洋', '其他邊界', '其他國家邊界', '其他路徑', '路徑', '路徑-2', '色塊', '邊界', '填充', '填充-2', '國界', '行政', '選舉', '公投', '勢力', '图层_1', '图层_56', '爭議地區', '海外島嶼', '海外領土', '本土', 'Neues_Musterfeld_17', 'St4', 'St5', 'St6', 'St7', 'St8', 'St9', 'St10', 'St11', 'St12', 'St13', 'St14', 'St15', 'St16', 'St17', 'St18', 'St19', 'St20', 'St21', 'St22', 'St23', 'St24', 'St25', 'St26', 'St27', 'St28', 'St29', 'St30', 'St31', 'St32', 'St33', 'St34', 'St35', 'St36', 'St37', 'St38', 'St39', 'St40', 'St41', 'St42', 'St43', 'St44', 'St45', 'St46', 'St47', 'St48', 'St49', 'St50', 'St51', 'St52', 'St53', 'St54', 'St55', 'St56', 'St57', 'St58', 'St59', 'St60', 'St61', 'St62', 'St63', 'St64', 'St65', 'St66', 'St67', 'St68', 'St69', 'St70', 'St71', 'St72', 'St73', 'St74', 'St75', 'St76', 'St77', 'St78', 'St79', 'St80', 'St81', 'St82', 'St83', 'St84', 'St85', 'St86', 'St87', 'St88', 'St89', 'St90', 'St91', 'St92', 'St93', 'St94', 'St95', 'St96', 'St97', 'St98', 'St99', 'St100', 'St101', 'St102', 'St103', 'St104', 'St105', 'St106', 'St107', 'St108', 'St109', 'St110', 'St111', 'St112', 'St113', 'St114', 'St115', 'St116', 'St117', 'St118', 'St119', 'St120', 'St121', 'St122', 'St123', 'St124', 'St125', 'St126', 'St127', 'St128', 'St129', 'St130', 'St131', 'St132', 'St133', 'St134', 'St135', 'St136', 'St137', 'St138', 'St139', 'St140', 'St141', 'St142', 'St143', 'St144', 'St145', 'St146', 'St147', 'St148', 'St149', 'St150', 'St151', 'St152', 'St153', 'St154', 'St155', 'St156', 'St157', 'St158', 'St159', 'St160', 'St161', 'St162', 'St163', 'St164', 'St165', 'St166', 'St167', 'St168', 'St169', 'St170', 'St171', 'St172', 'St173', 'St174', 'St175', 'St176', 'St177', 'St178', 'St179', 'St180', 'St181', 'St182', 'St183', 'St184', 'St185', 'St186', 'St187', 'St188', 'St189', 'St190', 'St191', 'St192', 'St193', 'St194', 'St195', 'St196', 'St197', 'St198', 'St199', 'St200'):
            return
        
        if clean_gid in ('國家',):
            for child in elem:
                process_group(child, path_depth + 1)
            return
        
        is_country = clean_gid in CN_TO_ID
        is_sub_country = path_depth > 0 and clean_gid not in ('填充', '海外領土', '本土', '海峽群島', '總督府', '其他邊界', '其他國家邊界', '邊界', '路徑', '路徑-2')
        
        if is_country or is_sub_country:
            paths = extract_paths(elem, SVG_NS)
            if paths:
                cid = CN_TO_ID.get(clean_gid, clean_gid)
                if cid not in countries:
                    countries[cid] = {'zh': clean_gid, 'paths': []}
                countries[cid]['paths'].extend(paths)
        
        for child in elem:
            tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
            if tag == 'g':
                process_group(child, path_depth + 1)
    
    for child in root:
        tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
        if tag == 'g':
            process_group(child, 0)
    
    return view, countries

os.makedirs(OUTPUT_DIR, exist_ok=True)

svg_files = {
    'einheitspakt': 'Einheitspakt.svg',
    'america': 'America.svg',
    'geacs': 'Greater East Asia Co-Prosperity Sphere.svg',
    'russia': 'Russia regions map.svg',
    'south_asia': 'South Asia.svg',
    'triumvirate': 'Triumvirate.svg',
    'einheitspakt_afrika': 'Einheitspakt Afrika.svg',
    'west_africa': 'West Africa.svg',
    'antarctica': 'Antarctica map.svg',
}

all_maps = {}

for map_id, filename in svg_files.items():
    filepath = os.path.join(SVG_DIR, filename)
    if not os.path.exists(filepath):
        print(f'SKIP: {filepath} not found')
        continue
    
    print(f'Processing {filename}...')
    try:
        view, countries = collect_country_data(filepath)
        print(f'  View: {view}')
        print(f'  Countries: {len(countries)}')
        for cid, data in sorted(countries.items()):
            print(f'    {cid} ({data["zh"]}): {len(data["paths"])} paths')
        
        all_maps[map_id] = {
            'name': map_id,
            'filename': filename,
            'view': view,
            'countries': countries
        }
    except Exception as e:
        print(f'  ERROR: {e}')
        import traceback
        traceback.print_exc()

output = {}
for map_id, map_data in all_maps.items():
    output[map_id] = {
        'name': map_data['name'],
        'view': map_data['view'],
        'countries': {}
    }
    for cid, cdata in map_data['countries'].items():
        output[map_id]['countries'][cid] = {
            'zh': cdata['zh'],
            'path_count': len(cdata['paths']),
            'paths': cdata['paths']
        }

output_path = os.path.join(OUTPUT_DIR, 'svg_countries.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

total_countries = sum(len(m['countries']) for m in output.values())
print(f'\nTotal country/map entries: {total_countries}')
print(f'Output: {output_path}')
print(f'File size: {os.path.getsize(output_path)} bytes')
