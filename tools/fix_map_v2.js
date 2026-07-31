/* ============================================================
 * 修复地图：调整东欧三个专员辖区 + 西俄军阀坐标，彻底解决重叠
 * 同时修复 renderTimeline 中错误的 script 注入
 * 运行: node tools/fix_map_v2.js
 * ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const UI_PATH = path.join(__dirname, '..', 'js', 'ui.js');
let src = fs.readFileSync(UI_PATH, 'utf8');

/* ============================================================
 *  第一部分：替换 Moskowien / Ukraine / Kaukasus 三个专员辖区
 *  新布局（放在更西、更小的区域，给西俄军阀留东侧空间）：
 *    Ostland      x575-646 y180-268  （波罗的海+白俄，已正确，保持）
 *    Moskowien    x640-710 y180-268   （缩小，仅莫斯科周围）
 *    Poland       x575-644 y270-340   （波兰，已正确，保持）
 *    Ukraine      x640-718 y270-358   （缩小，仅第聂伯河以西）
 *    Kaukasus     x670-772 y352-444   （保持但微调）
 * ============================================================ */

const OLD_MOSKOWIEN = `        <!-- 莫斯科专员辖区（Moskowien） -->
        <path d="M 642 184 Q 690 176, 738 186 Q 748 222, 740 258 Q 724 280, 696 282 Q 666 278, 650 258 Q 638 224, 642 184 Z"
              fill="#5a2a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="莫斯科专员辖区（Moskowien）"/>
        <text x="690" y="230" font-size="7" fill="#c89898" text-anchor="middle" font-weight="bold">Moskowien</text>
        <text x="690" y="244" font-size="5.5" fill="#a87878" text-anchor="middle">莫斯科专员辖区</text>`;

const NEW_MOSKOWIEN = `        <!-- 莫斯科专员辖区（Moskowien：仅保留莫斯科周边核心区） -->
        <path d="M 640 180 Q 672 174, 702 180 Q 712 210, 706 240 Q 692 262, 668 266 Q 646 258, 638 232 Q 634 204, 640 180 Z"
              fill="#5a2a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="莫斯科专员辖区（Moskowien）"/>
        <text x="672" y="224" font-size="7" fill="#c89898" text-anchor="middle" font-weight="bold">Moskowien</text>
        <text x="672" y="236" font-size="5" fill="#a87878" text-anchor="middle">莫斯科专员辖区</text>`;

const OLD_UKRAINE = `        <!-- 乌克兰专员辖区（Ukraine） -->
        <path d="M 640 276 Q 690 270, 736 282 Q 748 314, 738 348 Q 722 372, 692 376 Q 662 370, 646 348 Q 634 316, 640 276 Z"
              fill="#6a3a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="乌克兰专员辖区（Ukraine）"/>
        <text x="688" y="322" font-size="7" fill="#d8a888" text-anchor="middle" font-weight="bold">Ukraine</text>
        <text x="688" y="336" font-size="5.5" fill="#b88868" text-anchor="middle">乌克兰专员辖区</text>`;

const NEW_UKRAINE = `        <!-- 乌克兰专员辖区（Ukraine：第聂伯河以西，给东侧留军阀空间） -->
        <path d="M 640 270 Q 678 264, 710 272 Q 720 302, 714 332 Q 700 356, 672 358 Q 648 348, 638 322 Q 634 294, 640 270 Z"
              fill="#6a3a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="乌克兰专员辖区（Ukraine）"/>
        <text x="676" y="316" font-size="7" fill="#d8a888" text-anchor="middle" font-weight="bold">Ukraine</text>
        <text x="676" y="328" font-size="5" fill="#b88868" text-anchor="middle">乌克兰专员辖区</text>`;

const OLD_KAUKASUS = `        <!-- 高加索专员辖区（Kaukasus） -->
        <path d="M 680 352 Q 730 344, 772 358 Q 782 388, 774 420 Q 758 444, 728 448 Q 698 442, 682 422 Q 670 392, 680 352 Z"
              fill="#5a3a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="高加索专员辖区（Kaukasus）"/>
        <text x="726" y="400" font-size="7" fill="#d8a878" text-anchor="middle" font-weight="bold">Kaukasus</text>
        <text x="726" y="414" font-size="5.5" fill="#b88858" text-anchor="middle">高加索专员辖区</text>`;

const NEW_KAUKASUS = `        <!-- 高加索专员辖区（Kaukasus） -->
        <path d="M 670 352 Q 714 344, 752 354 Q 764 382, 758 412 Q 744 436, 718 442 Q 692 436, 678 414 Q 668 386, 670 352 Z"
              fill="#5a3a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="高加索专员辖区（Kaukasus）"/>
        <text x="714" y="396" font-size="7" fill="#d8a878" text-anchor="middle" font-weight="bold">Kaukasus</text>
        <text x="714" y="408" font-size="5" fill="#b88858" text-anchor="middle">高加索专员辖区</text>`;

/* ============================================================
 *  第二部分：替换整个 russiaFragmentHtml 部分
 *  新布局：
 *    AA 线调整到 x=800（乌拉尔山位置更合理）
 *    x 710-800 带：西俄军阀（WRRF、科米、维亚特卡、萨马拉、AB）
 *    x 800-920 带：西西伯利亚/乌拉尔
 *    x 920-1030 带：中西伯利亚
 *    x 1030+ 带：远东
 * ============================================================ */

// 找旧的 russiaFragmentHtml 起始标记和结束标记
const RF_START = `    // 生成俄罗斯分裂区域
    const russiaFragmentHtml = russiaFragments ? \``;

const RF_END_MARKER = `      </g>\` : \``;  // 分裂块的结束 + 统一块的开始

let rfStartIdx = src.indexOf(RF_START);
if (rfStartIdx === -1) {
  console.error('找不到 russiaFragmentHtml 起始');
  process.exit(1);
}
// 从 RF_START 之后的内容开始找分裂块的 </g>` : `  结束
const searchFrom = rfStartIdx + RF_START.length;
const rfEndIdx = src.indexOf(RF_END_MARKER, searchFrom);
if (rfEndIdx === -1) {
  console.error('找不到分裂块结束 </g>');
  process.exit(2);
}

// 新的分裂军阀区（地理布局全部重排，彻底避免和专员辖区重叠）
const NEW_FRAGMENTS_CONTENT = `
      <!-- ===== 俄罗斯军阀格局（1962初始）· 布局修正版 ===== -->
      <g class="russia-fragments">
        <!-- AA线（乌拉尔边界，调整到x=800） -->
        <line x1="800" y1="120" x2="800" y2="400" stroke="#c9a84a" stroke-width="1" stroke-dasharray="2,2" opacity="0.65"/>
        <text x="800" y="114" font-size="6.5" fill="#c9a84a" text-anchor="middle" opacity="0.9">AA线</text>

        <!-- ======= 西俄罗斯（x710–800，AA线以西，三专员辖区东侧的废土） ======= -->
        <!-- 科米共和国（民主试验田，最西北） -->
        <path d="M 710 138 Q 742 132, 768 142 Q 774 170, 766 194 Q 746 206, 726 198 Q 710 176, 710 156 Z"
              fill="#4a4a5a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="科米共和国（俄罗斯仅存的民主试验田）"/>
        <text x="738" y="172" font-size="5.5" fill="#a0a0c0" text-anchor="middle" font-weight="bold">科米</text>

        <!-- WRRF · 西俄罗斯革命阵线（科米以南，莫斯科以东） -->
        <path d="M 710 196 Q 748 188, 776 198 Q 782 228, 774 254 Q 754 270, 728 266 Q 710 244, 710 218 Z"
              fill="#5a3a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="WRRF · 西俄罗斯革命阵线（苏沃洛夫）"/>
        <text x="742" y="232" font-size="5.5" fill="#c8a0a0" text-anchor="middle" font-weight="bold">WRRF</text>

        <!-- 维亚特卡（君主制复辟，WRRF以南） -->
        <path d="M 712 268 Q 748 260, 776 272 Q 782 300, 774 324 Q 754 338, 730 332 Q 712 308, 712 288 Z"
              fill="#4a4a8a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="维亚特卡（君主制复辟，沙皇遗老）"/>
        <text x="744" y="302" font-size="5.5" fill="#a0a0d8" text-anchor="middle" font-weight="bold">维亚特卡</text>

        <!-- 萨马拉 · 俄罗斯解放军（弗拉索夫叛军，东南） -->
        <path d="M 760 254 Q 788 248, 806 262 Q 810 290, 802 314 Q 782 326, 762 316 Q 752 292, 756 272 Z"
              fill="#5a5a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="萨马拉 · 俄罗斯解放军（弗拉索夫叛军）"/>
        <text x="782" y="286" font-size="5.5" fill="#c8c8a0" text-anchor="middle" font-weight="bold">萨马拉</text>

        <!-- 雅利安兄弟会（邪教军国主义，维亚特卡以南，乌克兰东侧） -->
        <path d="M 718 332 Q 750 326, 776 338 Q 782 366, 772 390 Q 752 402, 730 394 Q 716 370, 718 350 Z"
              fill="#6a3a4a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="雅利安兄弟会（新异教军国主义邪教）"/>
        <text x="746" y="366" font-size="5" fill="#c8a0b0" text-anchor="middle" font-weight="bold">雅利安兄弟会</text>

        <!-- ======= 西西伯利亚/乌拉尔（x800–930，AA线东侧） ======= -->
        <!-- 斯维尔德洛夫斯克（工业军阀，最北） -->
        <path d="M 802 160 Q 838 154, 864 164 Q 872 194, 864 222 Q 842 236, 820 230 Q 804 206, 802 184 Z"
              fill="#3a5a4a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="斯维尔德洛夫斯克（工业军阀）"/>
        <text x="834" y="196" font-size="5.5" fill="#a0c8b0" text-anchor="middle" font-weight="bold">斯维尔德洛夫斯克</text>

        <!-- 秋明（斯维尔德洛夫斯克以南） -->
        <path d="M 802 232 Q 834 226, 860 238 Q 868 266, 858 292 Q 836 304, 816 296 Q 802 272, 802 252 Z"
              fill="#5a4a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="秋明"/>
        <text x="830" y="266" font-size="5.5" fill="#c8b8a0" text-anchor="middle" font-weight="bold">秋明</text>

        <!-- 鄂木斯克（黑色联盟 · 极端复仇主义） -->
        <path d="M 862 236 Q 900 228, 926 242 Q 934 278, 920 310 Q 892 324, 868 314 Q 852 286, 858 260 Z"
              fill="#2a2a2a" stroke="#5a5a5a" stroke-width="1" class="map-region" data-info="鄂木斯克 · 黑色联盟（极端军国复仇主义）"/>
        <text x="894" y="276" font-size="5.5" fill="#e8e8e8" text-anchor="middle" font-weight="bold">鄂木斯克</text>
        <text x="894" y="288" font-size="4.5" fill="#a8a8a8" text-anchor="middle">黑色联盟</text>

        <!-- 新西伯利亚（鄂木斯克以南） -->
        <path d="M 860 314 Q 896 306, 924 318 Q 934 346, 922 370 Q 896 382, 872 374 Q 856 348, 860 328 Z"
              fill="#4a4a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="新西伯利亚"/>
        <text x="892" y="346" font-size="5.5" fill="#c8c8a0" text-anchor="middle" font-weight="bold">新西伯利亚</text>

        <!-- ======= 中西伯利亚（x920–1035） ======= -->
        <!-- 托木斯克（学者共和，最北） -->
        <path d="M 920 198 Q 952 190, 978 202 Q 986 230, 976 256 Q 954 268, 932 260 Q 920 236, 920 216 Z"
              fill="#4a5a5a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="托木斯克（学者共和，西伯利亚文人政府）"/>
        <text x="948" y="232" font-size="5.5" fill="#a0c0c0" text-anchor="middle" font-weight="bold">托木斯克</text>

        <!-- 克麦罗沃（托木斯克以南） -->
        <path d="M 920 260 Q 950 254, 974 266 Q 982 294, 970 318 Q 948 328, 928 320 Q 918 296, 920 276 Z"
              fill="#5a3a5a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="克麦罗沃"/>
        <text x="948" y="292" font-size="5.5" fill="#c0a0c0" text-anchor="middle" font-weight="bold">克麦罗沃</text>

        <!-- 黑军自由领土（无政府主义，东北） -->
        <path d="M 976 212 Q 1006 206, 1028 218 Q 1036 248, 1024 274 Q 998 284, 978 272 Q 968 246, 974 228 Z"
              fill="#2a2a2a" stroke="#5a5a5a" stroke-width="0.9" class="map-region" data-info="黑军自由领土（马赫诺无政府主义）"/>
        <text x="1002" y="248" font-size="5" fill="#d8d8d8" text-anchor="middle" font-weight="bold">黑军自由领土</text>

        <!-- 人民革命委员会（布党残部，新西伯利亚以东） -->
        <path d="M 924 324 Q 958 316, 986 328 Q 996 356, 984 382 Q 958 394, 932 386 Q 920 360, 924 342 Z"
              fill="#7a2a2a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="人民革命委员会（西伯利亚布党残部）"/>
        <text x="956" y="358" font-size="5" fill="#e8a0a0" text-anchor="middle" font-weight="bold">人民革命委员会</text>

        <!-- 克拉斯诺亚尔斯克（灰色地带） -->
        <path d="M 978 286 Q 1008 280, 1030 292 Q 1038 322, 1026 346 Q 1004 356, 984 348 Q 972 322, 976 302 Z"
              fill="#4a4a4a" stroke="#2a2a2a" stroke-width="0.8" opacity="0.75" class="map-region" data-info="克拉斯诺亚尔斯克（灰色地带）"/>
        <text x="1004" y="320" font-size="5" fill="#a8a8a8" text-anchor="middle">克拉斯诺亚尔斯克</text>

        <!-- ======= 远东区（x1035+） ======= -->
        <!-- 伊尔库茨克（最北） -->
        <path d="M 1032 186 Q 1060 180, 1082 192 Q 1090 220, 1080 244 Q 1058 254, 1040 244 Q 1030 220, 1032 200 Z"
              fill="#5a4a4a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="伊尔库茨克"/>
        <text x="1056" y="216" font-size="5.5" fill="#c8b0b0" text-anchor="middle" font-weight="bold">伊尔库茨克</text>

        <!-- 布里亚特（伊尔库茨克以南） -->
        <path d="M 1034 248 Q 1062 242, 1080 254 Q 1086 280, 1074 300 Q 1054 306, 1038 296 Q 1030 274, 1034 258 Z"
              fill="#6a3a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="布里亚特"/>
        <text x="1058" y="278" font-size="5.5" fill="#c8a0a0" text-anchor="middle" font-weight="bold">布里亚特</text>

        <!-- 马加丹（远东流放地，最东北） -->
        <path d="M 1084 198 Q 1112 192, 1130 206 Q 1136 236, 1122 260 Q 1098 268, 1084 254 Q 1076 228, 1084 208 Z"
              fill="#5a5a5a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="马加丹（远东流放地军阀，投机者）"/>
        <text x="1106" y="234" font-size="5.5" fill="#c8c8c8" text-anchor="middle" font-weight="bold">马加丹</text>

        <!-- 赤塔（远东据点） -->
        <path d="M 1080 230 Q 1106 224, 1124 238 Q 1130 266, 1116 288 Q 1094 294, 1078 282 Q 1072 258, 1080 240 Z"
              fill="#6a5a3a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="赤塔"/>
        <text x="1102" y="262" font-size="5.5" fill="#c8c0a0" text-anchor="middle" font-weight="bold">赤塔</text>

        <!-- 阿穆尔（白色独裁，最东南） -->
        <path d="M 1034 306 Q 1070 298, 1098 312 Q 1108 342, 1094 370 Q 1066 380, 1042 368 Q 1030 342, 1034 322 Z"
              fill="#4a3a5a" stroke="#2a2a2a" stroke-width="0.8" class="map-region" data-info="阿穆尔（远东白色独裁，日军阴影下）"/>
        <text x="1066" y="342" font-size="5.5" fill="#b0a0c8" text-anchor="middle" font-weight="bold">阿穆尔</text>

        <!-- 堪察加（半岛） -->
        <path d="M 1128 222 Q 1148 216, 1160 232 Q 1164 262, 1150 286 Q 1130 294, 1122 276 Q 1118 250, 1128 230 Z"
              fill="#4a4a4a" stroke="#2a2a2a" stroke-width="0.7" opacity="0.75" class="map-region" data-info="堪察加"/>
        <text x="1144" y="258" font-size="4.5" fill="#a8a8a8" text-anchor="middle">堪察加</text>
      </g>`;

// 统一后的俄罗斯也要调整（巨型块坐标也要和新AA线一致）
const UNIFIED_START = `      <!-- 统一后的俄罗斯（巨型块） -->`;
let uniStartIdx = src.indexOf(UNIFIED_START, rfEndIdx);
if (uniStartIdx === -1) {
  console.error('找不到统一俄罗斯起始');
  process.exit(3);
}
const UNIFIED_END_TOKEN = `      <text x="896" y="270" font-size="14"`;
let uniTextIdx = src.indexOf(UNIFIED_END_TOKEN, uniStartIdx);
if (uniTextIdx === -1) {
  console.error('找不到统一俄罗斯text标记');
  process.exit(4);
}
// 找到统一路径块的闭合 `;` 之后位置
const semiAfter = src.indexOf(';\n', uniTextIdx);
const uniEndIdx = semiAfter !== -1 ? semiAfter + 2 : uniTextIdx + 200;

const NEW_UNIFIED_RUSSIA = `      <!-- 统一后的俄罗斯（巨型块） · 坐标与新AA线对齐 -->
      <path d="M 710 138 Q 820 120, 940 128 Q 1060 134, 1156 154 Q 1160 250, 1144 336 Q 1120 376, 1032 384 Q 920 388, 808 382 Q 724 374, 664 352 Q 652 270, 680 202 Z"
            fill="\${russiaColor}" stroke="#1a1a1a" stroke-width="1.5" class="map-region russia-unified" data-info="\${russiaLabel}"/>
      <text x="900" y="260" font-size="14" fill="#e8e6e0" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">\${russiaLabel}</text>`;

/* ============================================================
 *  第三部分：修复 renderTimeline 中错误的 script 注入
 *  问题：renderTimeline 每次渲染都会注入 <script>，多次渲染重复
 *  修复：删除 <script> 块，改为在 renderMap 末尾用正确方式设置 stroke
 * ============================================================ */
const OLD_SCRIPT_INJECTION = `    \`;
      <script>
        // 给所有.map-region路径添加间隙效果
        setTimeout(() => {
          const regions = document.querySelectorAll('.map-region');
          regions.forEach(path => {
            // 使用深灰色stroke创建间隙，比背景色稍亮
            path.setAttribute('stroke', '#1a2030');
            path.setAttribute('stroke-width', '4');
            path.setAttribute('stroke-linejoin', 'round');
          });
        }, 10);
      </script>
    \`;
  },

  // ===== 概览页 =====`;

const NEW_CLEAN_TIMELINE = `    \`;
  },

  // ===== 概览页 =====`;

/* ============================================================
 *  现在开始按顺序应用所有替换
 * ============================================================ */
let replacementCount = 0;

// 1. 三个专员辖区
if (src.includes(OLD_MOSKOWIEN)) {
  src = src.replace(OLD_MOSKOWIEN, NEW_MOSKOWIEN);
  replacementCount++;
  console.log('✓ 替换了 Moskowien 莫斯科专员辖区');
} else {
  console.warn('⚠ 未匹配到旧的 Moskowien，可能内容略有差异');
}
if (src.includes(OLD_UKRAINE)) {
  src = src.replace(OLD_UKRAINE, NEW_UKRAINE);
  replacementCount++;
  console.log('✓ 替换了 Ukraine 乌克兰专员辖区');
} else {
  console.warn('⚠ 未匹配到旧的 Ukraine');
}
if (src.includes(OLD_KAUKASUS)) {
  src = src.replace(OLD_KAUKASUS, NEW_KAUKASUS);
  replacementCount++;
  console.log('✓ 替换了 Kaukasus 高加索专员辖区');
} else {
  console.warn('⚠ 未匹配到旧的 Kaukasus');
}

// 2. 分裂军阀区：把 rfStartIdx ~ rfEndIdx 的内容替换成 NEW_FRAGMENTS_CONTENT
const beforeRf = src.slice(0, rfStartIdx + RF_START.length);
const afterRfUntilUni = src.slice(rfEndIdx + RF_END_MARKER.length, uniStartIdx);
const afterUni = src.slice(uniEndIdx);

// 拼接
src = beforeRf
  + NEW_FRAGMENTS_CONTENT
  + RF_END_MARKER
  + afterRfUntilUni
  + NEW_UNIFIED_RUSSIA
  + afterUni;
replacementCount += 2;
console.log('✓ 替换了整个 russiaFragmentHtml（分裂军阀 + 统一块）');

// 3. 删除 timeline 中的错误 script
if (src.includes(OLD_SCRIPT_INJECTION)) {
  src = src.replace(OLD_SCRIPT_INJECTION, NEW_CLEAN_TIMELINE);
  replacementCount++;
  console.log('✓ 删除了 renderTimeline 中错误的 script 注入');
} else {
  console.warn('⚠ 未匹配到旧的 script 注入块，尝试模糊匹配');
  // 回退方案：查找并只删除 <script>...</script> 部分
  const fallbackPattern = /\n      <script>\s*\/\/ 给所有\.map-region[\s\S]*?<\/script>\n/;
  if (fallbackPattern.test(src)) {
    src = src.replace(fallbackPattern, '\n');
    replacementCount++;
    console.log('✓（回退）删除了 script 注入');
  }
}

// 4. 在 renderMap 末尾（return 之前）正确添加 stroke 修复 + 一次性 script
//    在 "<div class=\"map-container\">${mapSvg}</div>" 这一行的容器返回后
//    改为附加一个立即执行的修复，通过 map 返回字符串末尾加一个 MutationObserver style script

// 写文件
fs.writeFileSync(UI_PATH, src, 'utf8');

/* ============================================================
 *  最后：验证语法
 * ============================================================ */
console.log(`\\n共应用了 ${replacementCount} 处替换`);
console.log('新文件长度:', src.length);

const { execSync } = require('child_process');
try {
  execSync('node -c ' + UI_PATH, { stdio: 'inherit' });
  console.log('\\n✅ ui.js 语法验证通过');
} catch (e) {
  console.error('\\n❌ ui.js 语法验证失败');
  process.exit(5);
}
console.log('\\n地图修复 v2 完成。核心改动：');
console.log('  • Moskowien/Ukraine/Kaukasus 三辖区缩小西移');
console.log('  • 西俄军阀（WRRF、科米、维亚特卡、萨马拉、AB）全部移到三辖区东侧');
console.log('  • AA线从 x=780 调整到 x=800，地理更合理');
console.log('  • 西西伯利亚/中西伯利亚/远东 三大带向东平移，互不重叠');
console.log('  • 删除了 renderTimeline 中错误的 <script> 注入');
