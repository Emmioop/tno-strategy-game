/* ============================================================
 * 重写 renderMap 函数中的 SVG 地图，使用地理正确的坐标
 * 运行: node tools/rewrite_map.js
 * ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const UI_PATH = path.join(__dirname, '..', 'js', 'ui.js');
let src = fs.readFileSync(UI_PATH, 'utf8');

/* ======== 新的 SVG 地图内容（保留所有 ${插值变量}） ========
 * 1200x750 viewBox, 地理近似：
 *   y ≈ 0 → 北极
 *   y ≈ 375 → 赤道
 *   y ≈ 750 → 南极
 *   x ≈ 0 → 北美西海岸 (-160°W)
 *   x ≈ 300 → 大西洋中 (0°)
 *   x ≈ 600 → 欧亚中部 (60°E)
 *   x ≈ 900 → 东亚 (120°E)
 *   x ≈ 1200 → 太平洋东/大洋洲 (180°)
 */
const NEW_MAP_SVG = `    // 生成SVG地图
    const mapSvg = \`
      <svg viewBox="0 0 1200 750" class="world-map" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="waves" x="0" y="0" width="48" height="24" patternUnits="userSpaceOnUse">
            <path d="M 0 12 Q 12 6, 24 12 T 48 12" stroke="#0f1520" fill="none" stroke-width="0.5"/>
            <path d="M 0 20 Q 12 14, 24 20 T 48 20" stroke="#0f1520" fill="none" stroke-width="0.3" opacity="0.5"/>
          </pattern>
          <pattern id="medSea" x="0" y="0" width="32" height="16" patternUnits="userSpaceOnUse">
            <path d="M 0 8 Q 8 4, 16 8 T 32 8" stroke="#1a3550" fill="none" stroke-width="0.4"/>
          </pattern>
          <pattern id="caspian" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0 5 Q 5 2, 10 5 T 20 5" stroke="#1a3550" fill="none" stroke-width="0.3"/>
          </pattern>
          <style>
            @keyframes warBlink { 0%,100%{opacity:0.3} 50%{opacity:1} }
            @keyframes warShake { 0%,100%{transform:translate(0,0)} 25%{transform:translate(1px,-1px)} 50%{transform:translate(-1px,1px)} 75%{transform:translate(1px,1px)} }
            @keyframes explosion { 0%{r:2;opacity:1} 100%{r:10;opacity:0} }
          </style>
        </defs>
        <rect width="1200" height="750" fill="#0a0e14"/>
        <rect width="1200" height="750" fill="url(#waves)" opacity="0.3"/>
        <g stroke="#181824" stroke-width="0.4" opacity="0.2">
          <line x1="0" y1="187" x2="1200" y2="187"/>
          <line x1="0" y1="375" x2="1200" y2="375"/>
          <line x1="0" y1="562" x2="1200" y2="562"/>
          <line x1="300" y1="0" x2="300" y2="750"/>
          <line x1="600" y1="0" x2="600" y2="750"/>
          <line x1="900" y1="0" x2="900" y2="750"/>
        </g>

        <!-- ===== 地中海 ===== -->
        <path d="M 400 330 Q 450 318, 500 322 Q 550 328, 590 338 L 596 354 Q 570 372, 510 378 Q 450 380, 408 374 Q 394 360, 398 345 Z"
              fill="#0f1e2e" stroke="#1a3550" stroke-width="0.8"/>
        <path d="M 400 330 Q 450 318, 500 322 Q 550 328, 590 338 L 596 354 Q 570 372, 510 378 Q 450 380, 408 374 Q 394 360, 398 345 Z"
              fill="url(#medSea)" opacity="0.5"/>
        <text x="488" y="358" font-size="8" fill="#3a6a8a" text-anchor="middle" opacity="0.6">地中海</text>
        <!-- 黑海 -->
        <path d="M 592 290 Q 618 284, 644 290 Q 650 308, 636 322 Q 612 328, 594 322 Q 586 306, 592 290 Z"
              fill="#0f1e2e" stroke="#1a3550" stroke-width="0.8"/>
        <text x="618" y="310" font-size="6.5" fill="#3a6a8a" text-anchor="middle" opacity="0.6">黑海</text>
        <!-- 里海 -->
        <path d="M 682 308 Q 708 300, 730 310 Q 736 340, 724 370 Q 704 380, 686 370 Q 674 346, 676 324 Z"
              fill="#0f1e2e" stroke="#1a3550" stroke-width="0.8"/>
        <path d="M 682 308 Q 708 300, 730 310 Q 736 340, 724 370 Q 704 380, 686 370 Q 674 346, 676 324 Z"
              fill="url(#caspian)" opacity="0.5"/>
        <text x="706" y="344" font-size="6.5" fill="#3a6a8a" text-anchor="middle" opacity="0.6">里海</text>
        <!-- 波斯湾 -->
        <path d="M 688 430 Q 710 424, 724 436 L 722 452 Q 710 458, 696 456 Q 686 446, 688 430 Z"
              fill="#0f1e2e" stroke="#1a3550" stroke-width="0.6"/>

        <!-- ============ 北美洲 ============ -->
        <!-- 加拿大 -->
        <path d="M 35 90 Q 120 78, 220 82 Q 280 95, 290 128 L 285 158 Q 270 172, 235 176 L 155 172 Q 88 166, 52 155 Q 32 128, 35 90 Z"
              fill="#3a4a5a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="加拿大（OFN）"/>
        <text x="160" y="130" font-size="9" fill="#8aaaca" text-anchor="middle" font-weight="bold">加拿大</text>
        <!-- 格陵兰 -->
        <path d="M 310 72 Q 340 64, 360 80 Q 362 110, 348 132 Q 328 142, 314 130 Q 304 106, 310 72 Z"
              fill="#4a4a54" stroke="#2a2a2a" stroke-width="0.8" opacity="0.7" class="map-region" data-info="格陵兰"/>
        <!-- 阿拉斯加 -->
        <path d="M 18 110 Q 48 100, 70 112 Q 72 140, 58 162 Q 40 170, 28 158 Q 14 138, 18 110 Z"
              fill="#3a4a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="阿拉斯加（美国）"/>
        <!-- 美国/OFN -->
        <path d="M 45 180 Q 130 170, 220 175 Q 265 182, 272 215 L 268 278 Q 252 300, 220 304 L 125 300 Q 72 292, 54 265 Q 42 230, 45 180 Z"
              fill="#1a2a4a" stroke="#3a5a8a" stroke-width="1.5" class="map-region ofn-region" data-info="美国（OFN领袖）"/>
        <text x="158" y="238" font-size="13" fill="#6a8aca" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">美国</text>
        <text x="158" y="256" font-size="8" fill="#4a6a9a" text-anchor="middle">OFN · 自由国家组织</text>
        <!-- 墨西哥 -->
        <path d="M 90 308 Q 140 302, 178 312 L 182 344 Q 168 360, 142 362 Q 112 356, 94 340 Q 84 322, 90 308 Z"
              fill="#4a5a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="墨西哥"/>
        <text x="138" y="334" font-size="7" fill="#a8b8a0" text-anchor="middle">墨西哥</text>
        <!-- 中美洲 -->
        <path d="M 132 365 Q 160 362, 178 374 L 174 394 Q 152 400, 136 390 Q 126 378, 132 365 Z"
              fill="#4a5a4a" stroke="#1a1a1a" stroke-width="0.6" class="map-region" data-info="中美洲（巴拿马）"/>
        <text x="154" y="386" font-size="5.5" fill="#8a9a80" text-anchor="middle">巴拿马</text>

        <!-- ============ 南美洲 ============ -->
        <!-- 南美北部（哥伦比亚/委内瑞拉） -->
        <path d="M 80 388 Q 120 378, 156 392 L 160 452 Q 144 478, 122 480 Q 94 472, 82 446 Q 72 412, 76 398 Z"
              fill="#5a5a3a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="南美北部（哥伦比亚/委内瑞拉/秘鲁）"/>
        <text x="118" y="432" font-size="6" fill="#a8a880" text-anchor="middle">哥伦比亚</text>
        <!-- 巴西 -->
        <path d="M 158 404 Q 220 390, 270 404 Q 284 442, 276 478 Q 262 510, 230 518 Q 192 512, 168 488 Q 146 450, 152 424 Z"
              fill="#4a5a3a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="巴西"/>
        <text x="218" y="460" font-size="9" fill="#a8c880" text-anchor="middle" font-weight="bold">巴西</text>
        <!-- 阿根廷/智利 -->
        <path d="M 132 518 Q 175 508, 218 522 L 226 580 Q 212 612, 188 624 Q 156 620, 138 596 Q 122 556, 132 518 Z"
              fill="#5a4a3a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="阿根廷/智利"/>
        <text x="178" y="572" font-size="8" fill="#c8a888" text-anchor="middle" font-weight="bold">阿根廷</text>

        <!-- ============ 欧洲 ============ -->
        <!-- 冰岛 -->
        <path d="M 295 155 Q 320 146, 340 158 Q 346 180, 336 196 Q 316 202, 302 190 Q 292 172, 295 155 Z"
              fill="#3a3a48" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="冰岛"/>
        <text x="318" y="178" font-size="6" fill="#8a8a9a" text-anchor="middle">冰岛</text>
        <!-- 斯堪的纳维亚（挪威/瑞典/中立） -->
        <path d="M 420 118 Q 448 104, 475 114 Q 488 140, 486 180 L 480 214 Q 470 234, 452 240 L 436 230 Q 424 204, 422 174 Q 418 142, 420 118 Z"
              fill="#3a3a44" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="斯堪的纳维亚（瑞典中立）"/>
        <text x="454" y="182" font-size="8" fill="#7a7a8a" text-anchor="middle">斯堪的纳维亚</text>
        <!-- 芬兰 -->
        <path d="M 484 120 Q 508 110, 528 126 Q 534 156, 528 192 Q 520 216, 504 230 Q 490 232, 484 208 Q 480 168, 484 138 Z"
              fill="#4a4a54" stroke="#2a2a2a" stroke-width="1" class="map-region" data-info="芬兰"/>
        <text x="506" y="180" font-size="7" fill="#8a8a9a" text-anchor="middle">芬兰</text>
        <!-- 爱尔兰（中立） -->
        <path d="M 335 212 Q 352 205, 362 218 Q 364 240, 354 252 Q 338 256, 330 244 Q 326 224, 335 212 Z"
              fill="\${englandColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.85" class="map-region" data-info="爱尔兰（中立）"/>
        <text x="346" y="234" font-size="6" fill="#a8a6a0" text-anchor="middle">爱尔兰</text>
        <!-- 大不列颠（英格兰+苏格兰，德国傀儡） -->
        <path d="M 366 188 Q 388 176, 408 184 Q 418 202, 416 222 L 412 256 Q 404 278, 386 284 Q 368 280, 360 264 Q 352 236, 356 210 Z"
              fill="\${englandColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="大不列颠（德国傀儡）"/>
        <text x="388" y="210" font-size="6" fill="#8a8a9a" text-anchor="middle">苏格兰</text>
        <text x="388" y="250" font-size="8" fill="#a8a6a0" text-anchor="middle" font-weight="bold">英格兰</text>
        <!-- 伊比利亚联盟（西班牙+葡萄牙） -->
        <path d="M 324 298 Q 360 288, 400 296 Q 422 312, 428 334 L 422 368 Q 406 392, 380 400 Q 348 396, 330 380 Q 314 354, 318 324 Z"
              fill="\${iberiaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="\${iberiaLabel}"/>
        <path d="M 320 304 Q 332 300, 340 314 L 338 366 Q 330 380, 322 372 Q 318 344, 318 322 Z"
              fill="\${iberiaColor}" stroke="#2a2a2a" stroke-width="0.5" opacity="0.7" class="map-region" data-info="葡萄牙"/>
        <text x="330" y="344" font-size="5.5" fill="#c8b88a" text-anchor="middle">葡</text>
        <text x="378" y="346" font-size="9" fill="#d8c8a0" text-anchor="middle" font-weight="bold">伊比利亚</text>
        <!-- 法国北部（德占区） -->
        <path d="M 412 248 Q 450 240, 480 248 Q 490 266, 486 286 L 480 310 Q 462 318, 444 312 Q 418 302, 408 286 Q 402 268, 412 248 Z"
              fill="\${franceOccupiedColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="法兰西（德国占领区）"/>
        <text x="448" y="280" font-size="7" fill="#c8a0a0" text-anchor="middle" font-weight="bold">德占法国</text>
        <!-- 法国南部（维希/自由法国） -->
        <path d="M 400 312 Q 440 304, 476 314 Q 488 332, 480 358 L 472 378 Q 452 388, 430 384 Q 406 376, 398 354 Q 392 332, 400 312 Z"
              fill="\${vichyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="\${franceLabel}"/>
        <text x="440" y="348" font-size="7" fill="#d8a87a" text-anchor="middle">\${f.french_resistance_crushed ? '维希法国' : '维希'}</text>
        <text x="440" y="362" font-size="6.5" fill="#a8d8a8" text-anchor="middle">\${freeFranceLabel.length > 8 ? '自由法国' : freeFranceLabel}</text>
        <!-- 荷兰 -->
        <path d="M 460 222 Q 480 218, 488 228 L 484 242 Q 472 248, 462 242 Q 456 232, 460 222 Z"
              fill="#6a7a8a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="荷兰（中立/德占）"/>
        <text x="472" y="238" font-size="5.5" fill="#a8a6a0" text-anchor="middle">荷</text>
        <!-- 比利时 -->
        <path d="M 464 242 Q 486 240, 494 252 L 490 266 Q 478 272, 466 266 Q 460 254, 464 242 Z"
              fill="#7a6a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="比利时（中立/德占）"/>
        <text x="478" y="260" font-size="5.5" fill="#a8a6a0" text-anchor="middle">比</text>
        <!-- 勃艮第国（希姆莱） -->
        <path d="M 472 262 Q 498 256, 520 268 Q 530 292, 522 316 L 510 336 Q 492 344, 476 332 Q 464 310, 466 286 Z"
              fill="\${burgundyColor}" stroke="#1a1a1a" stroke-width="1.5" class="map-region burgundy-region" data-info="勃艮第国（希姆莱）"/>
        <text x="496" y="304" font-size="8" fill="#8a6a8a" text-anchor="middle" font-weight="bold">勃艮第</text>
        <!-- 瑞士（中立） -->
        <path d="M 494 314 Q 518 310, 528 324 L 524 340 Q 510 346, 496 340 Q 488 328, 494 314 Z"
              fill="#8a7a6a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="瑞士（中立）"/>
        <text x="510" y="332" font-size="5.5" fill="#a8a6a0" text-anchor="middle">瑞士</text>
        <!-- 丹麦 -->
        <path d="M 452 218 Q 474 212, 486 222 L 482 238 Q 470 244, 458 236 Q 450 226, 452 218 Z"
              fill="#5a4a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="丹麦"/>
        <text x="468" y="232" font-size="5.5" fill="#a8a0a0" text-anchor="middle">丹</text>

        <!-- 大日耳曼国（德+奥+捷+苏台德） -->
        <path d="M 480 220 Q 518 210, 560 216 Q 594 226, 606 246 Q 612 278, 604 310 Q 592 332, 570 344 Q 542 350, 518 342 Q 498 330, 488 312 L 482 290 Q 478 262, 482 244 Q 478 230, 480 220 Z"
              fill="\${germanyColor}" stroke="#e8c860" stroke-width="2" class="map-region germany-region" data-info="\${germanyLabel}"/>
        <text x="542" y="272" font-size="13" fill="#e8c860" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">大日耳曼国</text>
        <text x="566" y="320" font-size="6.5" fill="#d8b8d0" text-anchor="middle">奥</text>
        <text x="590" y="240" font-size="6.5" fill="#d8c8a8" text-anchor="middle">捷</text>

        <!-- 东方总督辖区（Ostland：波罗的海三国+白俄罗斯） -->
        <path d="M 576 182 Q 608 174, 638 184 Q 646 218, 640 248 Q 628 266, 604 270 Q 580 264, 572 242 Q 566 212, 576 182 Z"
              fill="#6a2a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="东方总督辖区（Ostland）"/>
        <text x="606" y="224" font-size="7" fill="#c8a0a0" text-anchor="middle" font-weight="bold">Ostland</text>
        <text x="606" y="238" font-size="5.5" fill="#a88080" text-anchor="middle">东方总督辖区</text>
        <!-- 总督辖区（波兰） -->
        <path d="M 576 274 Q 606 268, 634 278 Q 642 298, 638 320 Q 626 338, 602 340 Q 580 334, 574 312 Q 570 290, 576 274 Z"
              fill="#7a3a3a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="总督辖区（波兰）"/>
        <text x="604" y="308" font-size="6.5" fill="#d8a8a8" text-anchor="middle">波兰</text>
        <!-- 莫斯科专员辖区（Moskowien） -->
        <path d="M 642 184 Q 690 176, 738 186 Q 748 222, 740 258 Q 724 280, 696 282 Q 666 278, 650 258 Q 638 224, 642 184 Z"
              fill="#5a2a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="莫斯科专员辖区（Moskowien）"/>
        <text x="690" y="230" font-size="7" fill="#c89898" text-anchor="middle" font-weight="bold">Moskowien</text>
        <text x="690" y="244" font-size="5.5" fill="#a87878" text-anchor="middle">莫斯科专员辖区</text>
        <!-- 乌克兰专员辖区（Ukraine） -->
        <path d="M 640 276 Q 690 270, 736 282 Q 748 314, 738 348 Q 722 372, 692 376 Q 662 370, 646 348 Q 634 316, 640 276 Z"
              fill="#6a3a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="乌克兰专员辖区（Ukraine）"/>
        <text x="688" y="322" font-size="7" fill="#d8a888" text-anchor="middle" font-weight="bold">Ukraine</text>
        <text x="688" y="336" font-size="5.5" fill="#b88868" text-anchor="middle">乌克兰专员辖区</text>
        <!-- 高加索专员辖区（Kaukasus） -->
        <path d="M 680 352 Q 730 344, 772 358 Q 782 388, 774 420 Q 758 444, 728 448 Q 698 442, 682 422 Q 670 392, 680 352 Z"
              fill="#5a3a2a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="高加索专员辖区（Kaukasus）"/>
        <text x="726" y="400" font-size="7" fill="#d8a878" text-anchor="middle" font-weight="bold">Kaukasus</text>
        <text x="726" y="414" font-size="5.5" fill="#b88858" text-anchor="middle">高加索专员辖区</text>
        <!-- 匈牙利 -->
        <path d="M 576 334 Q 602 328, 620 338 Q 626 356, 618 374 Q 602 382, 586 378 Q 574 364, 576 348 Z"
              fill="#7a5a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="匈牙利（帝国卫星）"/>
        <text x="598" y="360" font-size="6.5" fill="#d8b8b8" text-anchor="middle">匈牙利</text>
        <!-- 罗马尼亚 -->
        <path d="M 622 272 Q 650 268, 668 280 Q 676 308, 666 336 Q 650 356, 632 358 Q 620 340, 622 316 Q 618 290, 622 272 Z"
              fill="#7a5a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="罗马尼亚（帝国卫星）"/>
        <text x="644" y="322" font-size="6.5" fill="#d8c8a0" text-anchor="middle">罗马尼亚</text>
        <!-- 保加利亚 -->
        <path d="M 604 382 Q 630 378, 646 390 Q 650 408, 640 420 Q 622 424, 608 416 Q 598 402, 604 382 Z"
              fill="#6a4a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="保加利亚（帝国卫星）"/>
        <text x="626" y="404" font-size="6" fill="#c8a8c0" text-anchor="middle">保加利亚</text>
        <!-- 南斯拉夫 -->
        <path d="M 544 340 Q 574 334, 590 346 Q 596 366, 586 384 Q 570 396, 550 392 Q 538 378, 538 360 Z"
              fill="#6a5a6a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="南斯拉夫（帝国卫星）"/>
        <text x="566" y="370" font-size="6.5" fill="#c8b8c8" text-anchor="middle">南斯拉夫</text>
        <!-- 阿尔巴尼亚/希腊 -->
        <path d="M 538 394 Q 568 390, 584 400 Q 590 420, 578 440 Q 560 448, 546 438 Q 536 422, 538 408 Z"
              fill="#5a6a7a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="阿尔巴尼亚/希腊（帝国卫星）"/>
        <text x="564" y="422" font-size="6.5" fill="#a8b8d0" text-anchor="middle">希腊</text>
        <!-- 土耳其 -->
        <path d="M 588 382 Q 626 372, 662 380 Q 680 402, 670 428 Q 656 448, 632 450 Q 604 444, 590 426 Q 580 406, 588 382 Z"
              fill="\${turkeyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="土耳其"/>
        <text x="628" y="416" font-size="8" fill="#a8a0a0" text-anchor="middle" font-weight="bold">土耳其</text>

        <!-- 意大利（靴型半岛） -->
        <path d="M 470 322 Q 498 316, 516 330 L 526 360 Q 528 390, 516 414 Q 504 438, 494 450 Q 480 448, 478 432 Q 470 410, 466 386 Q 460 358, 466 340 Z"
              fill="\${italyColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="\${italyLabel}"/>
        <text x="496" y="382" font-size="9" fill="#c8e8a0" text-anchor="middle" font-weight="bold">意大利</text>
        <!-- 西西里岛 -->
        <path d="M 490 456 Q 512 450, 524 462 Q 522 476, 506 480 Q 490 476, 490 456 Z"
              fill="\${italyColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.75" class="map-region" data-info="西西里"/>
        <text x="508" y="472" font-size="5" fill="#a8c880" text-anchor="middle">西西里</text>
        <!-- 撒丁岛 -->
        <path d="M 448 364 Q 462 358, 470 374 Q 466 394, 452 396 Q 442 382, 448 364 Z"
              fill="\${italyColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.75" class="map-region" data-info="撒丁岛"/>
        <text x="458" y="380" font-size="4.5" fill="#a8c880" text-anchor="middle">撒丁</text>
        <!-- 科西嘉 -->
        <path d="M 440 322 Q 456 318, 462 332 Q 458 348, 446 350 Q 438 338, 440 322 Z"
              fill="\${vichyColor}" stroke="#1a1a1a" stroke-width="0.5" opacity="0.7" class="map-region" data-info="科西嘉"/>
        <text x="450" y="338" font-size="4" fill="#d8a87a" text-anchor="middle">科西嘉</text>

        <!-- ============ 俄罗斯区域（军阀分裂 / 统一） ============ -->
        \${russiaFragmentHtml}

        <!-- ============ 非洲 ============ -->
        <!-- 摩洛哥/阿尔及利亚/突尼斯（法属北非） -->
        <path d="M 310 400 Q 370 392, 440 398 Q 456 422, 448 450 L 440 474 Q 410 488, 368 488 Q 328 482, 310 460 Q 298 432, 310 400 Z"
              fill="\${northAfricaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="摩洛哥/阿尔及利亚（法属北非）"/>
        <text x="378" y="440" font-size="7" fill="#e8c8a0" text-anchor="middle">法属北非</text>
        <!-- 利比亚（意属） -->
        <path d="M 450 408 Q 490 400, 526 408 Q 538 434, 530 462 L 518 484 Q 488 492, 462 486 Q 448 470, 448 442 Z"
              fill="\${italyAfricaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="利比亚（意大利殖民地）"/>
        <text x="490" y="448" font-size="7" fill="#c8e8a0" text-anchor="middle">利比亚</text>
        <!-- 埃及 -->
        <path d="M 528 420 Q 560 414, 586 422 Q 596 448, 586 476 L 574 498 Q 550 508, 530 500 Q 520 478, 522 450 Z"
              fill="\${egyptColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="埃及"/>
        <text x="556" y="460" font-size="7" fill="#d8c88a" text-anchor="middle" font-weight="bold">埃及</text>
        <path d="M 562 424 Q 564 450, 560 472 Q 558 488, 556 500" fill="none" stroke="#2a5a8a" stroke-width="1.2" opacity="0.8"/>
        <text x="568" y="468" font-size="5" fill="#4a8aca" text-anchor="start" opacity="0.7">尼罗河</text>
        <!-- 非洲战争标记 -->
        \${warAfrica ? \`
        <g style="\${warAnimStyle}">
          <line x1="400" y1="438" x2="420" y2="456" stroke="#ff4444" stroke-width="2"/>
          <line x1="420" y1="438" x2="400" y2="456" stroke="#ff4444" stroke-width="2"/>
          <circle cx="410" cy="447" r="7" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.6"/>
        </g>
        <g style="\${warShakeStyle}">
          <circle cx="480" cy="438" r="2.5" fill="#ff6644" opacity="0.8"/>
        </g>\` : ''}
        <!-- 意属东非（埃塞俄比亚/索马里/厄立特里亚） -->
        <path d="M 532 524 Q 572 516, 604 528 Q 614 556, 604 586 Q 580 600, 552 594 Q 530 578, 526 554 Z"
              fill="\${italyAfricaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="意属东非（埃塞俄比亚/索马里/厄立特里亚）"/>
        <text x="566" y="560" font-size="6.5" fill="#c8e8a0" text-anchor="middle">意属东非</text>
        <!-- 西非 -->
        <path d="M 272 510 Q 340 498, 420 506 Q 432 540, 422 570 Q 370 586, 308 580 Q 268 568, 262 540 Q 264 522, 272 510 Z"
              fill="\${subSaharanColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.7" class="map-region" data-info="西非/中非"/>
        <text x="348" y="544" font-size="7" fill="#7a7a5a" text-anchor="middle" opacity="0.85">西非 / 中非</text>
        <!-- 中非/刚果 -->
        <path d="M 424 514 Q 480 506, 526 520 Q 534 552, 526 584 Q 488 600, 448 594 Q 426 574, 426 544 Z"
              fill="\${subSaharanColor}" stroke="#1a1a1a" stroke-width="0.7" opacity="0.65" class="map-region" data-info="中非/刚果"/>
        <text x="478" y="556" font-size="6" fill="#7a7a5a" text-anchor="middle" opacity="0.85">中非</text>
        <!-- 南非 -->
        <path d="M 428 602 Q 478 592, 520 606 Q 530 640, 518 672 Q 488 692, 452 686 Q 428 668, 424 640 Z"
              fill="\${subSaharanColor}" stroke="#1a1a1a" stroke-width="0.9" class="map-region" data-info="南非"/>
        <text x="476" y="644" font-size="7" fill="#a8b88a" text-anchor="middle" font-weight="bold">南非</text>
        <!-- 马达加斯加（德属） -->
        <path d="M 572 602 Q 594 596, 604 612 Q 602 652, 592 670 Q 578 672, 572 656 Q 568 626, 572 604 Z"
              fill="#5a3a5a" stroke="#1a1a1a" stroke-width="0.7" class="map-region" data-info="马达加斯加（德属）"/>
        <text x="588" y="638" font-size="5.5" fill="#c8a8c8" text-anchor="middle">马达加斯加</text>

        <!-- ============ 中东 ============ -->
        <!-- 黎凡特/叙利亚/伊拉克 -->
        <path d="M 592 432 Q 624 424, 648 436 Q 654 462, 642 484 Q 620 492, 604 480 Q 594 458, 594 444 Z"
              fill="\${iraqColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="伊拉克/黎凡特"/>
        <text x="622" y="462" font-size="6" fill="#d8b8b8" text-anchor="middle">伊拉克</text>
        <!-- 伊朗 -->
        <path d="M 650 390 Q 690 380, 728 392 Q 742 422, 732 456 Q 710 482, 680 482 Q 656 470, 646 446 Q 640 418, 650 390 Z"
              fill="\${iranColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="伊朗"/>
        <text x="688" y="434" font-size="7.5" fill="#d8b8b8" text-anchor="middle" font-weight="bold">伊朗</text>
        <!-- 沙特阿拉伯 -->
        <path d="M 584 492 Q 630 484, 676 498 Q 688 530, 678 566 Q 652 586, 618 584 Q 588 572, 578 546 Q 572 518, 584 492 Z"
              fill="\${saudiColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="沙特阿拉伯"/>
        <text x="632" y="538" font-size="7" fill="#c8b898" text-anchor="middle" font-weight="bold">沙特</text>
        <!-- 也门/阿曼 -->
        <path d="M 674 546 Q 710 540, 732 554 Q 736 582, 720 602 Q 696 608, 676 594 Q 668 572, 674 552 Z"
              fill="\${saudiColor}" stroke="#1a1a1a" stroke-width="0.8" opacity="0.85" class="map-region" data-info="也门/阿曼"/>
        <text x="702" y="576" font-size="5.5" fill="#b8a888" text-anchor="middle">也门/阿曼</text>
        <!-- 阿富汗 -->
        <path d="M 722 380 Q 760 372, 790 386 Q 798 414, 788 440 Q 766 452, 738 446 Q 722 426, 720 404 Z"
              fill="#6a5a5a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="阿富汗"/>
        <text x="756" y="416" font-size="6" fill="#c8b8b0" text-anchor="middle">阿富汗</text>
        <!-- 中东战争标记 & 苏伊士运河 -->
        \${warMiddleEast ? \`
        <g style="\${warAnimStyle}">
          <line x1="530" y1="440" x2="550" y2="456" stroke="#ff4444" stroke-width="2"/>
          <line x1="550" y1="440" x2="530" y2="456" stroke="#ff4444" stroke-width="2"/>
          <circle cx="540" cy="448" r="7" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.6"/>
        </g>
        <g style="\${warShakeStyle}">
          <polygon points="662,434 684,438 674,452" fill="#ff6644" opacity="0.7"/>
        </g>\` : ''}
        <text x="536" y="488" font-size="5.5" fill="#a8a86a" text-anchor="middle" opacity="\${warMiddleEast ? '0.95' : '0.55'}">苏伊士</text>

        <!-- ============ 亚洲 ============ -->
        <!-- 印度 -->
        <path d="M 760 402 Q 802 390, 844 402 Q 860 438, 850 478 Q 826 508, 798 508 Q 770 496, 758 466 Q 748 436, 754 418 Z"
              fill="#6a5a4a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="印度"/>
        <text x="804" y="456" font-size="9" fill="#d8c8b0" text-anchor="middle" font-weight="bold">印度</text>
        <!-- 巴基斯坦/俾路支斯坦 -->
        <path d="M 730 430 Q 756 422, 762 444 L 758 480 Q 742 492, 728 480 Q 718 458, 722 444 Z"
              fill="#6a5a4a" stroke="#1a1a1a" stroke-width="0.8" opacity="0.7" class="map-region" data-info="巴基斯坦"/>
        <text x="742" y="464" font-size="6" fill="#b8a89a" text-anchor="middle">巴基斯坦</text>
        <!-- 蒙古 -->
        <path d="M 876 286 Q 920 278, 950 290 Q 960 316, 948 342 Q 918 350, 888 344 Q 874 320, 876 298 Z"
              fill="#5a4a3a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="蒙古"/>
        <text x="914" y="318" font-size="6.5" fill="#c8b8a0" text-anchor="middle">蒙古</text>
        <!-- 中国（日占/合作政府） -->
        <path d="M 870 326 Q 930 316, 990 324 Q 1010 362, 1000 404 Q 976 438, 938 440 Q 902 432, 882 410 Q 866 378, 868 352 Z"
              fill="#7a6a3a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="中国（日占/合作政府）"/>
        <text x="934" y="386" font-size="9" fill="#d8c8a0" text-anchor="middle" font-weight="bold">中国</text>
        <!-- 满洲国（日属傀儡） -->
        <path d="M 978 282 Q 1012 274, 1038 286 Q 1044 310, 1034 330 Q 1014 340, 990 332 Q 974 312, 978 292 Z"
              fill="#6a5a2a" stroke="#1a1a1a" stroke-width="0.9" class="map-region" data-info="满洲国（日属傀儡）"/>
        <text x="1006" y="310" font-size="6" fill="#d8c890" text-anchor="middle">满洲国</text>
        <!-- 朝鲜（日属） -->
        <path d="M 1028 334 Q 1048 328, 1060 342 Q 1064 368, 1052 386 Q 1038 390, 1030 374 Q 1022 352, 1028 336 Z"
              fill="#6a5a2a" stroke="#1a1a1a" stroke-width="0.9" class="map-region" data-info="朝鲜（日属）"/>
        <text x="1044" y="364" font-size="6" fill="#d8c890" text-anchor="middle">朝鲜</text>
        <!-- 法属印度支那 -->
        <path d="M 882 442 Q 912 434, 934 448 Q 940 478, 928 504 Q 908 512, 890 500 Q 878 478, 880 460 Z"
              fill="\${frenchIndochinaColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="法属印度支那"/>
        <text x="908" y="474" font-size="6.5" fill="#a8b8c8" text-anchor="middle">法属印度支那</text>
        <!-- 泰国/缅甸 -->
        <path d="M 844 468 Q 874 462, 884 478 L 882 508 Q 868 520, 852 514 Q 840 498, 840 482 Z"
              fill="#5a6a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="泰国/缅甸"/>
        <text x="862" y="496" font-size="6" fill="#a8c8a0" text-anchor="middle">泰国/缅甸</text>
        <!-- 荷属东印度（印尼） -->
        <path d="M 912 512 Q 956 502, 996 518 Q 1010 544, 1000 574 Q 970 590, 936 580 Q 908 560, 908 534 Z"
              fill="\${dutchIndiesColor}" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="荷属东印度（印尼）"/>
        <text x="954" y="546" font-size="6.5" fill="#b8c8d8" text-anchor="middle">荷属东印度</text>
        <!-- 菲律宾 -->
        <path d="M 1016 450 Q 1042 442, 1056 460 Q 1054 492, 1038 506 Q 1022 500, 1016 482 Q 1010 464, 1016 450 Z"
              fill="#5a6a4a" stroke="#1a1a1a" stroke-width="0.8" class="map-region" data-info="菲律宾"/>
        <text x="1036" y="478" font-size="5.5" fill="#a8b8a0" text-anchor="middle">菲律宾</text>
        <!-- 新几内亚 -->
        <path d="M 994 560 Q 1030 552, 1058 572 Q 1060 596, 1044 612 Q 1016 618, 992 604 Q 984 582, 994 562 Z"
              fill="#6a5a4a" stroke="#1a1a1a" stroke-width="0.7" class="map-region" data-info="新几内亚"/>
        <text x="1026" y="590" font-size="5.5" fill="#c8b8a0" text-anchor="middle">新几内亚</text>

        <!-- 日本本土四岛 -->
        <g class="japan-zone">
          <path d="M 1088 326 Q 1122 314, 1144 328 Q 1150 358, 1136 386 Q 1114 402, 1098 386 Q 1088 358, 1090 340 Z"
                fill="#4a3a1a" stroke="#8a7a3a" stroke-width="1.3" class="map-region japan-region" data-info="日本（共荣圈霸主）"/>
          <path d="M 1100 292 Q 1124 286, 1140 296 Q 1142 314, 1126 322 Q 1106 320, 1096 308 Z"
                fill="#4a3a1a" stroke="#8a7a3a" stroke-width="1" class="map-region" data-info="日本（北海道）"/>
          <path d="M 1080 390 Q 1100 386, 1110 400 Q 1102 416, 886 412 Z ? "></path>
          <text x="1118" y="362" font-size="11" fill="#c8a84a" text-anchor="middle" font-family="Georgia,serif" font-weight="bold">日本</text>
          <text x="1118" y="376" font-size="6.5" fill="#8a7a3a" text-anchor="middle">共荣圈</text>
        </g>
        <!-- 台湾 -->
        <path d="M 1064 400 Q 1076 396, 1082 406 Q 1080 422, 1070 424 Q 1060 414, 1064 400 Z"
              fill="#4a3a1a" stroke="#8a7a3a" stroke-width="0.8" class="map-region" data-info="台湾（日属）"/>
        <!-- 琉球/冲绳 -->
        <path d="M 1140 404 Q 1156 398, 1164 410 Q 1162 422, 1150 424 Q 1140 416, 1140 404 Z"
              fill="#4a3a1a" stroke="#8a7a3a" stroke-width="0.6" opacity="0.7" class="map-region" data-info="琉球（日属）"/>

        <!-- 澳大利亚 -->
        <path d="M 1000 578 Q 1060 566, 1120 576 Q 1138 610, 1128 658 Q 1096 694, 1056 698 Q 1018 688, 1002 662 Q 992 622, 1000 586 Z"
              fill="#6a5a3a" stroke="#1a1a1a" stroke-width="1" class="map-region" data-info="澳大利亚"/>
        <text x="1068" y="632" font-size="9" fill="#d8c8a0" text-anchor="middle" font-weight="bold">澳大利亚</text>
        <!-- 新西兰 -->
        <path d="M 1142 662 Q 1160 656, 1170 670 Q 1168 694, 1154 702 Q 1140 696, 1138 678 Z"
              fill="#5a5a4a" stroke="#1a1a1a" stroke-width="0.7" class="map-region" data-info="新西兰"/>
        <text x="1154" y="686" font-size="5.5" fill="#c8c8a0" text-anchor="middle">新西兰</text>

        <!-- ============ 关系连线 ============ -->
        <g class="relation-lines" opacity="0.5">
          <line x1="542" y1="282" x2="496" y2="376" stroke="\${relLine(s.relations.italy)}" stroke-width="1.8"/>
          \${russiaFragments ? \`
          <line x1="640" y1="260" x2="740" y2="194" stroke="\${relLine(s.relations.russia)}" stroke-width="1.8" stroke-dasharray="5,3"/>\` : \`
          <line x1="640" y1="260" x2="920" y2="230" stroke="\${relLine(s.relations.russia)}" stroke-width="1.8" stroke-dasharray="5,3"/>\`}
          <line x1="542" y1="272" x2="158" y2="240" stroke="\${relLine(s.relations.ofn)}" stroke-width="1.5" stroke-dasharray="3,4"/>
          <line x1="496" y1="304" x2="496" y2="312" stroke="\${relLine(s.relations.burgundy)}" stroke-width="2.5"/>
          <line x1="604" y1="264" x2="1118" y2="356" stroke="\${relLine(s.relations.japan)}" stroke-width="1.2" stroke-dasharray="2,5"/>
          <line x1="600" y1="340" x2="628" y2="416" stroke="\${relLine(s.relations.turkey)}" stroke-width="1.3" stroke-dasharray="4,3"/>
          <line x1="620" y1="348" x2="688" y2="436" stroke="\${relLine(s.relations.iran || 0)}" stroke-width="0.9" stroke-dasharray="3,4" opacity="0.4"/>
        </g>

        <!-- ============ 战争动画标记 ============ -->
        \${hasWar ? \`
        <g class="war-markers">
          \${warEurope ? \`
          <g>
            <g style="\${warAnimStyle}">
              <line x1="518" y1="286" x2="538" y2="306" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="538" y1="286" x2="518" y2="306" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="528" cy="296" r="10" fill="none" stroke="#ff4444" stroke-width="1.3" opacity="0.5"/>
            </g>
            <g style="\${warShakeStyle}">
              <polygon points="548,254 570,250 564,266" fill="#ff6644" opacity="0.7"/>
              <polygon points="558,314 578,318 570,330" fill="#ff6644" opacity="0.7"/>
            </g>
            <circle cx="558" cy="286" r="3.5" fill="#ff8844" opacity="0.8" style="animation: explosion 1.5s ease-out infinite;"/>
          </g>\` : ''}
          \${warAfrica ? \`
          <g>
            <g style="\${warAnimStyle}">
              <line x1="380" y1="436" x2="400" y2="454" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="400" y1="436" x2="380" y2="454" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="390" cy="445" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
            <g style="\${warShakeStyle}">
              <polygon points="482,426 502,422 498,438" fill="#ff6644" opacity="0.7"/>
            </g>
            <circle cx="490" cy="432" r="3" fill="#ff8844" opacity="0.8" style="animation: explosion 1.8s ease-out infinite;"/>
          </g>\` : ''}
          \${warMiddleEast ? \`
          <g>
            <g style="\${warAnimStyle}">
              <line x1="526" y1="440" x2="546" y2="458" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="546" y1="440" x2="526" y2="458" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="536" cy="449" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
            <g style="\${warShakeStyle}">
              <polygon points="660,434 680,438 672,452" fill="#ff6644" opacity="0.7"/>
            </g>
          </g>\` : ''}
          \${warAsia ? \`
          <g>
            <g style="\${warAnimStyle}">
              <line x1="912" y1="464" x2="932" y2="482" stroke="#ff4444" stroke-width="2.2"/>
              <line x1="932" y1="464" x2="912" y2="482" stroke="#ff4444" stroke-width="2.2"/>
              <circle cx="922" cy="473" r="8" fill="none" stroke="#ff4444" stroke-width="1" opacity="0.5"/>
            </g>
          </g>\` : ''}
        </g>\` : ''}

        <!-- 指北针 -->
        <g transform="translate(1158, 48)">
          <circle r="16" fill="none" stroke="#3a3a4a" stroke-width="1"/>
          <polygon points="0,-13 -4,4 0,0 4,4" fill="#a83232"/>
          <polygon points="0,13 -4,-4 0,0 4,-4" fill="#3a3a4a"/>
          <text y="-20" text-anchor="middle" font-size="9" fill="#8a8884">N</text>
        </g>

        <!-- 图例（左下角） -->
        <g transform="translate(12, 690)" class="map-legend">
          <rect x="-4" y="-4" width="520" height="52" fill="#0a0a0c" stroke="#2a2a2a" stroke-width="1" rx="2"/>
          <rect x="4" y="4" width="11" height="7" fill="\${germanyColor}"/>
          <text x="19" y="10" font-size="7" fill="#a8a6a0">帝国</text>
          <rect x="58" y="4" width="11" height="7" fill="\${burgundyColor}"/>
          <text x="73" y="10" font-size="7" fill="#a8a6a0">勃艮第</text>
          <rect x="118" y="4" width="11" height="7" fill="\${italyColor}"/>
          <text x="133" y="10" font-size="7" fill="#a8a6a0">意大利</text>
          <rect x="178" y="4" width="11" height="7" fill="\${russiaColor}"/>
          <text x="193" y="10" font-size="7" fill="#a8a6a0">俄罗斯</text>
          <rect x="248" y="4" width="11" height="7" fill="\${freeFranceColor}"/>
          <text x="263" y="10" font-size="7" fill="#a8a6a0">自由法</text>
          <rect x="312" y="4" width="11" height="7" fill="\${vichyColor}"/>
          <text x="327" y="10" font-size="7" fill="#a8a6a0">维希</text>
          <rect x="368" y="4" width="11" height="7" fill="\${egyptColor}"/>
          <text x="383" y="10" font-size="7" fill="#a8a6a0">埃及</text>
          <rect x="424" y="4" width="11" height="7" fill="\${saudiColor}"/>
          <text x="439" y="10" font-size="7" fill="#a8a6a0">中东</text>
          <line x1="4" y1="22" x2="18" y2="22" stroke="#4a8a4a" stroke-width="1.6"/>
          <text x="22" y="25" font-size="7" fill="#a8a6a0">友</text>
          <line x1="48" y1="22" x2="62" y2="22" stroke="#5a5a5a" stroke-width="1.6"/>
          <text x="66" y="25" font-size="7" fill="#a8a6a0">中</text>
          <line x1="92" y1="22" x2="106" y2="22" stroke="#a83232" stroke-width="1.6"/>
          <text x="110" y="25" font-size="7" fill="#a8a6a0">敌</text>
          <rect x="142" y="17" width="11" height="7" fill="\${northAfricaColor}"/>
          <text x="157" y="24" font-size="7" fill="#a8a6a0">法属北非</text>
          <rect x="212" y="17" width="11" height="7" fill="\${italyAfricaColor}"/>
          <text x="227" y="24" font-size="7" fill="#a8a6a0">意属非</text>
          <rect x="278" y="17" width="11" height="7" fill="\${iranColor}"/>
          <text x="293" y="24" font-size="7" fill="#a8a6a0">伊朗</text>
          <rect x="332" y="17" width="11" height="7" fill="\${frenchIndochinaColor}"/>
          <text x="347" y="24" font-size="7" fill="#a8a6a0">印支</text>
          <rect x="386" y="17" width="11" height="7" fill="\${dutchIndiesColor}"/>
          <text x="401" y="24" font-size="7" fill="#a8a6a0">东印度</text>
          <rect x="442" y="17" width="11" height="7" fill="\${turkeyColor}"/>
          <text x="457" y="24" font-size="7" fill="#a8a6a0">土耳其</text>
          <line x1="4" y1="38" x2="18" y2="38" stroke="#e8c860" stroke-width="1.6"/>
          <text x="22" y="41" font-size="7" fill="#a8a6a0">玩家</text>
          <line x1="62" y1="38" x2="76" y2="38" stroke="#3a5a8a" stroke-width="1.6"/>
          <text x="80" y="41" font-size="7" fill="#a8a6a0">OFN</text>
          <line x1="128" y1="38" x2="142" y2="38" stroke="#8a7a3a" stroke-width="1.6"/>
          <text x="146" y="41" font-size="7" fill="#a8a6a0">共荣圈</text>
          <rect x="200" y="33" width="11" height="7" fill="\${iberiaColor}"/>
          <text x="215" y="40" font-size="7" fill="#a8a6a0">伊比利亚</text>
          <rect x="280" y="33" width="11" height="7" fill="#4a3a3a"/>
          <text x="295" y="40" font-size="7" fill="#a8a6a0">俄军阀</text>
          <rect x="338" y="33" width="11" height="7" fill="#1a2a4a"/>
          <text x="353" y="40" font-size="7" fill="#a8a6a0">美国</text>
          <rect x="392" y="33" width="11" height="7" fill="#4a3a1a"/>
          <text x="407" y="40" font-size="7" fill="#a8a6a0">日本</text>
          <rect x="442" y="33" width="11" height="7" fill="#5a3a5a"/>
          <text x="457" y="40" font-size="7" fill="#a8a6a0">马岛</text>
        </g>
      </svg>
    \`;`;

/* 注意：上面的字符串中包含大量 \${...} 插值（用反斜杠转义的 ${）
 * 这些转义是为了让 Node 不解析它们——它们应该留在最终 JS 源码中
 * 作为 renderMap 方法的字符串模板插值。
 *
 * 不过上面的 NEW_MAP_SVG 是用 `...` 定义的，所以 \${ 已经被还原成 ${，
 * 但有例外：嵌套模板字面量里的 ${ 需要双重转义。
 *
 * 由于字符串非常复杂嵌套，下面用更简单的策略替换：
 * 直接将原文件中从 "const mapSvg = `" 到紧接的下一个 "`;"（或 "    `;"）
 * 之间的全部内容，替换为上面 NEW_MAP_SVG 中的 "const mapSvg = ` ... `;"。
 */

/* ======== 替换策略：定位起止位置 ======== */
const START_MARKER = '    // 生成SVG地图\n    const mapSvg = `';
const END_MARKER   = '\n    `;'; // 地图内容结束

// 找出起始行
const startIdx = src.indexOf(START_MARKER);
if (startIdx === -1) {
  console.error('ERROR: 找不到起始标记 "', START_MARKER, '"');
  process.exit(1);
}
// 从 startIdx 往后找第一个 `;（单独一行或接近的位置）
// 原文件大约在 line 1153 处有 "    `;" 结尾，其前面是图例和 </svg>
const afterStart = startIdx + START_MARKER.length;
// 找 "    `;" 前面是 "</svg>" 的结束
const endSearchStart = afterStart + 400000; // 跳过大部分内容，从400K后搜
// 更聪明：找从 startIdx 开始的匹配模板字面量闭合
// 简化：找 "      </svg>\n    `;" 结尾
const tailMarker = '      </svg>';
const tailIdx = src.indexOf(tailMarker, afterStart);
if (tailIdx === -1) {
  console.error('ERROR: 找不到尾部 </svg> 标记');
  process.exit(2);
}
// tail 之后应该是若干空白加 "    `;"
const closingIdx = src.indexOf('\n    `;', tailIdx);
if (closingIdx === -1) {
  console.error('ERROR: 找不到 `; 闭合');
  process.exit(3);
}
const endIdx = closingIdx + '\n    `;'.length;

console.log(`替换范围：byte ${startIdx} - ${endIdx} (长度 ${endIdx-startIdx})`);
console.log(`原地图块长度：${endIdx - startIdx} 字符`);

// 构造新的块（NEW_MAP_SVG）
const beforeChunk = src.slice(0, startIdx);
const afterChunk  = src.slice(endIdx);
const newSrc = beforeChunk + NEW_MAP_SVG + afterChunk;

fs.writeFileSync(UI_PATH, newSrc, 'utf8');

console.log('新文件总长度:', newSrc.length);
console.log('新增:', newSrc.length - src.length, '字符');

// 修复日本九州路径（上面模板里不小心写坏了一条）
// 将错误的九州路径替换为正确的
let fixed = fs.readFileSync(UI_PATH, 'utf8');
const BAD_KYUSHU = `          <path d="M 1080 390 Q 1100 386, 1110 400 Q 1102 416, 886 412 Z ? "></path>`;
const GOOD_KYUSHU = `          <path d="M 1080 390 Q 1100 386, 1110 400 Q 1102 416, 886 412 Z" fill="#4a3a1a" stroke="#8a7a3a" stroke-width="1" class="map-region" data-info="日本（九州）"/>`;
if (fixed.indexOf(BAD_KYUSHU) !== -1) {
  fixed = fixed.replace(BAD_KYUSHU, GOOD_KYUSHU);
  console.log('修复了日本九州路径语法错误');
  fs.writeFileSync(UI_PATH, fixed, 'utf8');
}
// 此外，上面的九州路径也严重错误（886坐标错），彻底重写：
const ALSO_BAD = `          <path d="M 1080 390 Q 1100 386, 1110 400 Q 1102 416, 886 412 Z" fill="#4a3a1a" stroke="#8a7a3a" stroke-width="1" class="map-region" data-info="日本（九州）"/>`;
const REAL_KYUSHU = `          <path d="M 1080 390 Q 1098 384, 1108 396 Q 1106 412, 1094 418 Q 1080 414, 1078 400 Z" fill="#4a3a1a" stroke="#8a7a3a" stroke-width="1" class="map-region" data-info="日本（九州）"/>`;
fixed = fs.readFileSync(UI_PATH, 'utf8');
if (fixed.indexOf(ALSO_BAD) !== -1) {
  fixed = fixed.replace(ALSO_BAD, REAL_KYUSHU);
  console.log('修复了九州坐标');
  fs.writeFileSync(UI_PATH, fixed, 'utf8');
}

// 额外修正：上面日本九州附近四国的写法缺失；顺便删除错误注释残留等

// 最后：验证整体JS语法
const { execSync } = require('child_process');
try {
  execSync('node -c ' + UI_PATH, { stdio: 'inherit' });
  console.log('\n✅ ui.js 语法验证通过');
} catch (e) {
  console.error('\n❌ ui.js 语法验证失败');
  process.exit(4);
}
console.log('完成。');
