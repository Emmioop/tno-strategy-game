import xml.etree.ElementTree as ET
import json
import re
import os

SVG_DIR = 'map_source/TNO maps - Vectorized by lilauid/svg maps'
OUTPUT_DIR = 'data/svg_maps'

CN_TO_ID = {
    '聯合王國': 'uk', '愛爾蘭': 'ireland', '大日耳曼國': 'germany',
    '挪威條約港': 'norway_port', '克里米亞': 'crimea',
    '尼德蘭總督轄區': 'netherlands', '黨衛軍勃艮第騎士團國': 'burgundy',
    '法蘭西國': 'france', '丹麥': 'denmark', '挪威總督轄區': 'norway',
    '斯洛伐克': 'slovakia', '匈牙利': 'hungary', '羅馬尼亞': 'romania',
    '塞爾維亞': 'serbia', '保加利亞': 'bulgaria',
    '烏克蘭專員轄區': 'ukraine', '東方專員轄區': 'ostland',
    '莫斯科專員轄區': 'moscow', '高加索專員轄區': 'caucasus',
    '美國': 'usa', '加拿大': 'canada', '墨西哥': 'mexico',
    '巴西': 'brazil', '阿根廷': 'argentina', '智利': 'chile',
    '秘魯': 'peru', '哥倫比亞': 'colombia', '委內瑞拉': 'venezuela',
    '厄瓜多爾': 'ecuador', '玻利維亞': 'bolivia', '巴拉圭': 'paraguay',
    '烏拉圭': 'uruguay', '古巴': 'cuba', '海地': 'haiti',
    '多米尼加': 'dominican', '巴拿馬': 'panama', '哥斯大黎加': 'costarica',
    '尼加拉瓜': 'nicaragua', '洪都拉斯': 'honduras', '危地馬拉': 'guatemala',
    '圭亞那': 'guyana', '圭亞那-卡宴': 'french_guiana', '新格拉納達': 'new_granada',
    '日本': 'japan', '滿洲國': 'manchuria', '中華民國': 'china',
    '廣東國': 'guangdong', '廣西省': 'guangxi', '貴州省': 'guizhou',
    '雲南省': 'yunnan', '晉綏行政公署': 'jinsui', '蒙疆聯合自治政府': 'mengjiang',
    '西北方面軍': 'northwest_frontier', '泰國': 'thailand', '越南': 'vietnam',
    '柬埔寨': 'cambodia', '寮國': 'laos', '緬甸': 'burma',
    '印度尼西亞': 'indonesia', '菲律賓': 'philippines', '自由印度': 'free_india',
    '印度共和國': 'india', '尼泊爾': 'nepal', '不丹自治省': 'bhutan',
    '海外島嶼': 'overseas_islands', '南洋軍政監': 'south_sea',
    '哈薩克': 'kazakhstan', '烏茲別克': 'uzbekistan',
    '土庫曼': 'turkmenistan', '吉爾吉斯': 'kyrgyzstan',
    '塔吉克': 'tajikistan', '卡拉卡爾帕克': 'karakalpakstan',
    '巴什科爾托': 'bashkortostan', '韃靼': 'tatarstan',
    '高爾基': 'gorky', '維亞特卡': 'vyatka', '科米': 'komi',
    '尤格拉': 'yugra', '沃洛格達': 'vologda', '奧涅加': 'onega',
    '奧倫堡': 'orenburg', '薩馬拉': 'samara', '馬格尼托格爾斯克': 'magnitogorsk',
    '茲拉特烏斯特': 'zlatooust', '迪勒萬格': 'dillinger',
    '聖格奧爾基': 'st_george', '烏拉爾聯盟': 'ural_union',
    '突厥斯坦軍團': 'turkestan_legion', '西俄羅斯革命陣線': 'west_russia',
    '雅利安兄弟會': 'aryan_brotherhood', '沃爾庫塔': 'vorkuta',
    '伊爾庫次克': 'irkutsk', '克拉斯諾亞爾斯克': 'krasnoyarsk',
    '克麥羅沃公國': 'kemerovo', '圖瓦': 'tuva',
    '外貝加爾': 'transbaikal', '太平洋艦隊': 'pacific_fleet',
    '奧伊羅特': 'oyrot', '布里亞特': 'buryat',
    '托木斯克': 'tomsk', '新西伯利亞': 'novosibirsk',
    '烏拉聯盟': 'ural_confederation', '自由飛行員': 'free_fighters',
    '西西伯利亞': 'west_siberia', '阿穆爾': 'amur',
    '雅庫特': 'yakutia', '馬加丹': 'magadan',
    '黑色聯盟': 'black_league', '黑軍': 'black_army',
    '伊朗帝國': 'iran', '伊拉克': 'iraq', '敘利亞': 'syria',
    '沙烏地阿拉伯': 'saudi', '葉門': 'yemen', '阿曼': 'oman',
    '阿富汗': 'afghanistan', '斯里蘭卡': 'sri_lanka',
    '海灣總督領': 'gulf', '摩蘇爾和基爾庫克': 'mosul_kirkuk',
    '卡拉特汗國': 'karat_khanate', '邊境諸省': 'border_provinces',
    '義大利': 'italy', '伊比利亞': 'spain', '克羅地亞': 'croatia',
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
    '莫西蘭': 'mossi', '迦納': 'ghana', '阿札瓦德': 'azawad',
    '馬里國': 'mali',
    '勃艮第南極': 'burgundy_antarctica', '新史瓦本': 'new_swabia',
    '日本南極': 'japan_antarctica', '智利南極': 'chile_antarctica',
    '阿根廷南極': 'argentina_antarctica', '澳大利亞': 'australia',
    '紐西蘭': 'new_zealand', '法國': 'france',
    '南非': 'south_africa', 'OFN託管地': 'ofn_trust',
    '英屬宏都拉斯': 'british_honduras', '薩爾瓦多': 'el_salvador',
    '蘇利南': 'suriname', '西印度群島聯邦': 'west_indies',
    '馬來亞': 'malaya',
}

SKIP_NAMES = {'填充', '填充-2', '底色', '海洋', '其他邊界', '其他國家邊界', '其他路徑', 
              '路徑', '路徑-2', '色塊', '邊界', '國界', '行政', '選舉', '公投', '勢力',
              '图层_1', '图层_56', '爭議地區', '海外島嶼', '海外領土', '本土',
              'Neues_Musterfeld_17', 'St4', 'St5', 'St6', 'St7', 'St8',
              '共和國', '其他', '卡拉特汗國'}

def clean_name(raw_id):
    name = raw_id
    name = re.sub(r'_\d+$', '', name)
    name = re.sub(r'-2$', '', name)
    name = re.sub(r'-3$', '', name)
    name = re.sub(r'-4$', '', name)
    name = re.sub(r'^_+', '', name)
    name = re.sub(r'_00\d+_$', '', name)
    return name.strip()

def extract_paths_from_elem(elem):
    paths = []
    for p in elem.iter('{http://www.w3.org/2000/svg}path'):
        d = p.get('d', '')
        if d and len(d) > 20:
            paths.append(d)
    for p in elem.iter('{http://www.w3.org/2000/svg}polygon'):
        pts = p.get('points', '')
        if pts and len(pts) > 10:
            paths.append('M' + pts + 'Z')
    for p in elem.iter('{http://www.w3.org/2000/svg}polyline'):
        pts = p.get('points', '')
        if pts and len(pts) > 10:
            paths.append('M' + pts)
    return paths

def normalize_d(d_str):
    d = d_str.strip()
    d = re.sub(r'\s+', ' ', d)
    d = re.sub(r'([MLAZ])\s*', r'\1', d)
    return d

def collect_map_data(svg_path):
    tree = ET.parse(svg_path)
    root = tree.getroot()
    
    view_box = root.get('viewBox', '0 0 100 100')
    parts = view_box.split()
    view = {'x': float(parts[0]), 'y': float(parts[1]), 
             'w': float(parts[2]), 'h': float(parts[3])}
    
    countries = {}
    
    def process_group(elem, depth, in_country_group):
        gid = elem.get('id', '')
        clean = clean_name(gid)
        
        should_skip = clean in SKIP_NAMES or clean.startswith('St') or clean.startswith('图层')
        if should_skip and not in_country_group:
            for child in elem:
                tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                if tag == 'g':
                    process_group(child, depth + 1, False)
            return
        
        if clean == '國家' or clean == '其他國家':
            for child in elem:
                tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
                if tag == 'g':
                    process_group(child, 0, True)
            return
        
        if in_country_group:
            cid = CN_TO_ID.get(clean, clean)
            if clean not in SKIP_NAMES and clean:
                paths = extract_paths_from_elem(elem)
                if paths:
                    if cid not in countries:
                        countries[cid] = {'zh': clean, 'paths': [], 'source': gid}
                    for p in paths:
                        countries[cid]['paths'].append(normalize_d(p))
        
        for child in elem:
            tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
            if tag == 'g':
                process_group(child, depth + 1, in_country_group)
    
    for child in root:
        tag = child.tag.split('}')[-1] if '}' in child.tag else child.tag
        if tag == 'g':
            process_group(child, 0, False)
    
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

map_info = {}

for map_id, filename in svg_files.items():
    filepath = os.path.join(SVG_DIR, filename)
    if not os.path.exists(filepath):
        continue
    
    print(f'Processing {filename}...')
    view, countries = collect_map_data(filepath)
    
    valid = {}
    for cid, data in countries.items():
        if cid != data['zh'] or data['zh'] in CN_TO_ID or cid in CN_TO_ID:
            valid[cid] = data
    
    print(f'  View: {view["w"]}x{view["h"]}, Countries: {len(valid)}')
    
    map_data = {
        'view': view,
        'countries': {}
    }
    for cid, data in valid.items():
        map_data['countries'][cid] = {
            'zh': data['zh'],
            'n': len(data['paths']),
            'p': data['paths']
        }
    
    out_path = os.path.join(OUTPUT_DIR, f'{map_id}.json')
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(map_data, f, ensure_ascii=False, separators=(',', ':'))
    
    size = os.path.getsize(out_path)
    print(f'  Saved: {out_path} ({size} bytes)')
    map_info[map_id] = {'file': out_path, 'size': size, 'countries': len(valid)}

index = {
    'maps': map_info,
    'total_countries': sum(m['countries'] for m in map_info.values())
}
index_path = os.path.join(OUTPUT_DIR, 'index.json')
with open(index_path, 'w', encoding='utf-8') as f:
    json.dump(index, f, ensure_ascii=False, separators=(',', ':'))

print(f'\nTotal countries: {index["total_countries"]}')
print(f'Index: {index_path}')
print(f'Index size: {os.path.getsize(index_path)} bytes')
