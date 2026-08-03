/* ============================================================
 * 千年帝国的最后一息 - UI 渲染与交互
 * ============================================================ */

// ============ UI 数据读取: 优先 DataStore, 失败回退到旧全局 ============
(function _defineUIHelpers(scope) {
  function _DS() {
    if (typeof DataStore !== 'undefined') return DataStore;
    if (scope.DataStore) return scope.DataStore;
    if (typeof window !== 'undefined' && window.DataStore) return window.DataStore;
    return null;
  }
  scope._uiGetBuildings = function () {
    const d = _DS(); if (d) { const r = d.getBuildings(); if (r && Object.keys(r).length) return r; }
    return BUILDINGS || {};
  };
  scope._uiGetTechs = function () {
    const d = _DS(); if (d) { const r = d.getTechs(); if (r && Object.keys(r).length) return r; }
    return TECHS || {};
  };
  scope._uiGetPolicies = function () {
    const d = _DS(); if (d) { const r = d.getPolicies(); if (r && Object.keys(r).length) return r; }
    return POLICIES || {};
  };
  scope._uiGetFoci = function () {
    const d = _DS(); if (d) { const r = d.getNationalFoci(); if (r && Object.keys(r).length) return r; }
    return NATIONAL_FOCI || {};
  };
  scope._uiGetSuccession = function () {
    const d = _DS(); if (d) { const r = d.getSuccessionPaths(); if (r && Object.keys(r).length) return r; }
    return SUCCESSION_PATHS || {};
  };
  scope._uiGetFactions = function () {
    const d = _DS(); if (d) { const r = d.getFactions(); if (r && Object.keys(r).length) return r; }
    return FACTIONS || {};
  };
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));

// ===== 结局定义 =====
const ENDINGS = {
  nuclear_holocaust: {
    id: 'nuclear_holocaust',
    tag: '末日结局',
    title: '诸神黄昏',
    text: `1962年，帝国登月，举世欢腾。但在你按下核按钮的那一刻，所有的荣耀都化为灰烬。\n\n三大国的导弹同时升空，地球的大气层被点燃，文明的灯火在一小时内熄灭。日耳曼尼亚、华盛顿、东京、莫斯科——所有伟大的首都都成了放射性废墟。希姆莱在地下堡垒中笑了：他的"净化"终于实现了。\n\n几百年后，残存的人类在废墟上重新学会用火。他们口口相传着一个故事：曾经有个帝国，活了一千年，然后用一个下午毁灭了世界。\n\n这是你选择的道路。`
  },
  democratic_reform: {
    id: 'democratic_reform',
    tag: '改革胜利',
    title: '帝国之春',
    text: `没有人想到这一切会以这种方式结束。\n\n施佩尔的改革——或者说，你推动的改革——最终让帝国脱胎换骨。奴隶制在1990年代彻底废除，自由选举在地方层面试行，美国与帝国签署了历史性的缓和协定。日耳曼尼亚不再是恐惧的代名词，而成了欧洲对话的舞台。\n\n2000年元旦，帝国举行了一场低调的庆典。没有阅兵，没有万字旗，只有一群老人在人民大会堂前默默饮酒。他们记得1962年的登月，记得内战的血，记得每一个让帝国走到今天的抉择。\n\n千年帝国没有活到一千年。但它活成了一个更好的自己。这，或许就够了。`
  },
  peaceful_coexistence: {
    id: 'peaceful_coexistence',
    tag: '黄金结局',
    title: '长夜将尽',
    text: `1989年那个秋夜，当你拒绝按下核按钮、选择斡旋时，世界屏住了呼吸。然后，它松了一口气。\n\n此后的十年，帝国、美国、日本与重新统一的俄罗斯，在磕磕绊绊中走向了一种脆弱的共存。核军控条约签署，殖民体系瓦解，互联网（如果你开放了它）让思想跨越了铁幕。帝国的青年与美国、日本的青年在网络上争吵、和解、相爱。\n\n2000年，四位大国领导人在日内瓦签署《新世纪宣言》，正式结束三极冷战。希特勒的阴影终于散去。\n\n帝国依然存在——它改名了，改革了，但血脉还在。而你的名字，被刻在了历史的一个角落：不是作为征服者，而是作为那个在最黑暗的时刻，选择了不按下按钮的人。`
  },
  reformist_survival: {
    id: 'reformist_survival',
    tag: '改革延续',
    title: '半途的黎明',
    text: `改革没有完全成功，但帝国活了下来。\n\n奴隶制被削弱但未废除，民主被引入但受限，与美国的关系缓和但未同盟。帝国成了一个矛盾的怪物——既非旧日的极权，也非真正的新生。\n\n2000年，老一代的改革者相继离世，年轻一代接过了权柄。他们不知道帝国将走向何方，只知道它还没有死。\n\n这或许就是最好的结局：不是胜利，不是失败，而是延续。在黑暗与光明之间，帝国选择了灰色——而灰色，至少意味着还有选择。`
  },
  reformist_failure: {
    id: 'reformist_failure',
    tag: '改革失败',
    title: '未竟之梦',
    text: `改革失败了。\n\n不是因为你不够努力，而是因为帝国的根基已经腐烂得太深。保守派的反扑、经济的动荡、奴隶的暴动、外部的压力——每一个都足以让改革夭折。当施佩尔（或他的继承人）在1990年代被迫下台时，旧势力卷土重来，比从前更加凶残。\n\n2000年，帝国又回到了1962年的样子：奴隶、黑市、党卫军、衰老的元首。只是这一次，连登月的荣耀都成了遥远的记忆。\n\n改革的火种没有熄灭——它只是被埋进了更深的地下。也许有一天，会有人重新点燃它。但不是今天。`
  },
  militarist_victory: {
    id: 'militarist_victory',
    tag: '军国胜利',
    title: '铁与火的新世纪',
    text: `戈林会为你骄傲——如果他没死的话。\n\n帝国用铁与火重塑了世界秩序。军国派的胜利让德国重新成为欧洲无可争议的霸主，军队是国家，国家是军队。威慑让美国与日本不敢轻举妄动，俄罗斯的复仇被扼杀在摇篮里。\n\n2000年，帝国举行了一场规模空前的阅兵。一万辆坦克碾过日耳曼尼亚的大街，一万架飞机掠过天空。人民挥舞着旗帜，高呼着元首的名字。\n\n没有人问：这一切的代价是什么？因为问问题的人，早已不在了。帝国赢了，但赢得的是什么，已经没人记得。`
  },
  militarist_stalemate: {
    id: 'militarist_stalemate',
    tag: '军国僵持',
    title: '武装的和平',
    text: `帝国没有赢，但也没有输。\n\n军国路线让德国维持了表面的强大，但内部早已被军费拖垮。每一个马克都变成了子弹，每一座工厂都在造坦克，而人民却在配给制下苟延残喘。\n\n2000年，帝国成了一个武装到牙齿的巨人——但巨人也有骨质疏松。美国与日本在等待，俄罗斯在等待，连帝国的将军们都在等待：什么时候，这个巨人会自己倒下？\n\n威慑维持着和平，但和平的代价，是帝国的灵魂。`
  },
  militarist_collapse: {
    id: 'militarist_collapse',
    tag: '军国崩溃',
    title: '将军们的黄昏',
    text: `军国路线走到尽头时，帝国成了一具穿着铠甲的尸体。\n\n经济崩溃，军队哗变，将军们为争夺残骸互相厮杀。美国趁机收复欧洲，俄罗斯收复东方，日本吞并亚太。日耳曼尼亚的万国旗换成了占领军的旗帜。\n\n2000年，曾经的大日耳曼国已经不存在。它的领土被瓜分，它的人民被清算，它的历史被改写。\n\n将军们说，武力能解决一切。他们是对的——武力解决了帝国本身。`
  },
  dark_victory: {
    id: 'dark_victory',
    tag: '黑暗结局',
    title: '永夜',
    text: `海德里希笑了。在某个地下深处，他终于笑了。\n\n帝国成了SS的国度，党卫军是法律，恐怖是秩序。集中营遍布欧洲，"劣等民族"被系统性地清除，连德国人自己都活在告密与消失的阴影中。核武器是帝国的盾牌，也是它的剑——指向任何胆敢反抗的人。\n\n2000年，世界其他地方假装帝国不存在。OFN闭上了眼睛，日本转过了身，俄罗斯躲在了乌拉尔之后。他们说，那里什么都没有，只有黑暗。\n\n而黑暗中，帝国还在运转。它不会停下，因为它的引擎是恐惧，而恐惧永不会枯竭。\n\n这是你选择的道路。愿你能在地狱中安眠。`
  },
  terror_state: {
    id: 'terror_state',
    tag: '恐怖结局',
    title: '面具之下',
    text: `帝国没有变成海德里希梦想的那种纯粹噩梦，但也没有逃离它的阴影。\n\nSS的权力被削弱但未消除，恐怖统治被缓和但未停止。帝国成了一个戴面具的国家——表面是秩序，下面是血。\n\n2000年，外人看帝国，看到的是强大的工业、整齐的街道、忠诚的人民。但他们看不到的是：每一个微笑背后，都有一个秘密警察；每一句赞美背后，都是一颗颤抖的心。\n\n帝国活着。但活着的，到底是什么？`
  },
  conservative_survival: {
    id: 'conservative_survival',
    tag: '保守延续',
    title: '停滞的永恒',
    text: `鲍曼会满意——帝国还是老样子。\n\n保守路线让德国维持了1962年的状态：奴隶制、黑市、党卫军、官僚机器，一切照旧。没有改革，没有崩溃，只有日复一日的停滞。帝国像一个老人，慢慢地、慢慢地、慢慢地老去。\n\n2000年，帝国还在。它的边境还在，它的旗帜还在，它的元首（已经是第三任了）还在。但没有人记得帝国为什么存在，除了"因为它一直存在"。\n\n这或许就是保守主义的胜利：不是让帝国变好，而是让它不变。直到某一天，不变本身成了死亡。`
  },
  conservative_decay: {
    id: 'conservative_decay',
    tag: '保守衰亡',
    title: '朽木',
    text: `帝国没有死于刀剑，它死于腐烂。\n\n保守路线无法应对新时代的挑战：计算机、互联网、全球化、环保——每一个都让旧体制摇摇欲坠。当OFN在2000年登陆月球时，帝国的航天局还在用1960年代的图纸。\n\n2000年，帝国还在，但只是"还在"。它的工业过时，它的军队老化，它的人民麻木。世界已经向前走，而帝国还在原地，像一块被时间遗忘的朽木。\n\n没有人来砍倒它。它只是慢慢地、自己地，化为了尘土。`
  },
  collapse: {
    id: 'collapse',
    tag: '崩溃结局',
    title: '分崩离析',
    text: `帝国终于撑不住了。\n\n稳定度归零的那一刻，一切看似突然，实则必然。各省独立，军队哗变，奴隶起义，邻国入侵。日耳曼尼亚的政府在一夜之间蒸发，留下的只有空荡的办公室和满地的文件。\n\n2000年，大日耳曼国成了历史书上的一个注脚。它的领土被瓜分，它的人民四散，它的故事被用来警告后人：极权主义的尽头，从来不是荣耀，而是瓦解。\n\n你尽力了。但有些东西，从一开始就注定无法挽回。`
  },
  economic_collapse: {
    id: 'economic_collapse',
    tag: '经济崩溃',
    title: '破产的帝国',
    text: `帝国的金库空了。\n\n数十年的赤字、借贷、印钞，最终压垮了经济机器。马克成了废纸，工厂停转，军队发不出军饷。当财政部长在2000年宣布"帝国破产"时，街头已经燃烧了三天。\n\n美国与国际货币基金组织伸出援手——但代价是帝国的独立。接受了援助的德国，从此成了华盛顿的附庸。\n\n千年帝国没有死于战争，它死于账本。这或许是最讽刺的结局。`
  },
  invasion: {
    id: 'invasion',
    tag: '战败结局',
    title: '铁蹄之下',
    text: `威慑崩溃的那一刻，敌人来了。\n\n俄罗斯的坦克碾过东方总督辖区，OFN的登陆舰驶向北海，日本的舰队封锁了波罗的海。帝国连象征性的抵抗都组织不起来——它的军队早已在内战与腐败中瓦解。\n\n2000年，柏林（它已经不叫日耳曼尼亚了）迎来了新的占领者。万国旗被降下，新的旗帜升起。帝国的人民看着这一切，有人哭泣，有人欢呼，更多人只是沉默。\n\n历史就是这样循环的：一个帝国倒下，另一个站起来。而你的帝国，成了倒下的那一个。`
  }
};

// ===== UI 主对象 =====
const UI = {

  currentTab: 'overview',
  pendingEvents: [],
  currentEventIndex: 0,
  // 懒加载状态标记
  _lazy: {
    eventsGenLoaded: false,
    eventsGenLoading: false,
    pendingFirstEvent: false
  },
  // tab渲染缓存（避免每次切换都innerHTML重建DOM）
  _tabCache: {},

  // ===== 懒加载工具 =====
  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[data-lazy="${src}"]`)) { resolve(); return; }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.setAttribute('data-lazy', src);
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('加载失败: ' + src));
      document.head.appendChild(s);
    });
  },

  // 加载 events_gen.js (84MB, 首屏跳过)
  async loadEventsGen() {
    if (this._lazy.eventsGenLoaded) return true;
    if (this._lazy.eventsGenLoading) {
      return new Promise(res => {
        const itv = setInterval(() => {
          if (this._lazy.eventsGenLoaded) { clearInterval(itv); res(true); }
        }, 100);
      });
    }
    this._lazy.eventsGenLoading = true;
    try {
      await this.loadScript('js/events_gen.js?v=30');
      this._lazy.eventsGenLoaded = true;
      return true;
    } catch (e) {
      console.warn(e);
      return false;
    } finally {
      this._lazy.eventsGenLoading = false;
    }
  },

  // 旧版 SVG 地图的 11MB map_extra.js 已弃用（第11阶段优化移除）
  // 保留空方法防止旧代码调用时报错
  async loadMapExtra() { return false; },

  // ===== 事件图片预加载（进入游戏后立即把所有事件图片缓存到浏览器，弹窗秒开） =====
  _eventImagesPreloaded: false,
  preloadEventImages() {
    if (this._eventImagesPreloaded) return;
    this._eventImagesPreloaded = true;
    setTimeout(() => {
      const paths = new Set();
      paths.add('img/events/ev_millennium_anxiety.jpg');

      // 全量预加载：所有已生成的事件图片（291张）
      const coreList = [
        'ev_2000_finale','ev_africa_scramble','ev_amur_white_army','ev_anarchy_west_africa','ev_armistice_day','ev_atlantropa','ev_atlantropa_aftermath','ev_atlantropa_consequences',
        'ev_biotech','ev_black_market','ev_boom_economy','ev_bormann_conservative_coalition','ev_bormann_naval_buildup','ev_bormann_party_machine','ev_bormann_purge_reformers','ev_bormann_stagnation',
        'ev_bormann_victory_hollow','ev_british_resistance','ev_british_underground','ev_burgundian_crisis','ev_burgundian_infiltration','ev_burgundian_war_result','ev_burgundy_aftermath','ev_burgundy_agents_ofn',
        'ev_burgundy_confrontation','ev_burgundy_deep_infiltration','ev_burgundy_doomsday_discovery','ev_burgundy_final_shadow','ev_burgundy_knights_state','ev_burgundy_nuclear_test','ev_burgundy_nuclear_theft','ev_burgundy_remnant_terror',
        'ev_buryat_sablin','ev_china_economic_collapse_1968','ev_china_occupation','ev_china_resistance_1968','ev_chita_monarchist','ev_choose_successor','ev_civil_war_battles','ev_civil_war_burgundy',
        'ev_civil_war_climax','ev_civil_war_end','ev_cold_war_finale','ev_computer_revolution','ev_congo_dam_crisis','ev_cps_china_inferno','ev_cps_decolonization','ev_cps_korea_uprising',
        'ev_cps_manchuria_resistance','ev_crimea_hofer','ev_decolonization_wave','ev_degaulle_return','ev_demographic_winter','ev_demographics','ev_economic_bubble_1982','ev_economic_collapse_1975',
        'ev_economic_miracle_1970','ev_end_of_cold_war','ev_energy_revolution','ev_env_protection','ev_environmental_crisis','ev_european_unification','ev_famine_1976','ev_fascist_legacy',
        'ev_final_five_years','ev_first_nile_war','ev_flood_1984','ev_free_france_rallying','ev_french_resistance','ev_gibraltar_dam_maintenance','ev_goering_war_economy','ev_goring_airforce_loyalty',
        'ev_goring_downfall','ev_goring_eastern_campaign','ev_goring_economic_spiral','ev_goring_military_disaster','ev_goring_war','ev_goring_war_plans','ev_great_recession','ev_heydrich_collapse',
        'ev_heydrich_descent','ev_heydrich_himmler_puppet','ev_heydrich_ss','ev_heydrich_ss_state','ev_heydrich_terror','ev_hitler_assassinated','ev_hitler_death','ev_hofer_crimea_navy',
        'ev_hofer_pirate_kingdom','ev_iberia_strain','ev_iberian_civil_war_1978','ev_iberian_collapse','ev_iberian_crisis','ev_iberian_federation_strain','ev_india','ev_indian_civil_war',
        'ev_indonesia','ev_indonesian_independence','ev_indonesian_resistance_1972','ev_internet_era','ev_iranian_revolution','ev_irktusk_yagoda','ev_italian_africa_collapse','ev_italian_colonial_wars',
        'ev_italian_democracy_movement','ev_italian_economic_crisis','ev_italy_ciano','ev_italy_democratization','ev_italy_leaves_german_sphere','ev_italy_leaves_sphere','ev_italy_triumvirate','ev_japan_democratization_1985',
        'ev_japan_economic_collapse','ev_japan_economic_crisis','ev_japan_economic_reform_1980','ev_japan_military_coup_1965','ev_japan_navy_army_split','ev_japan_reform','ev_japan_sphere_1968','ev_japan_yen_collapse',
        'ev_kemerovo_rurik','ev_kolonial_empire','ev_komi_democratic_experiment','ev_korea','ev_korean_uprising_1975','ev_latin_america','ev_lebanon_civil_war','ev_magadan_warlord',
        'ev_manchukuo_industrialization','ev_mediterranean_crisis','ev_mediterranean_draining','ev_mediterranean_new_order','ev_middle_east','ev_military_coup','ev_millennium_anxiety','ev_millennium_celebration',
        'ev_moon_landing','ev_neutral_zone','ev_neutral_zone_blackmarket','ev_neutral_zone_diplomats','ev_neutral_zone_refugees','ev_neutral_zone_resolution','ev_new_world_order_1992','ev_north_africa_rising',
        'ev_nuclear_arms_race','ev_nuclear_proliferation','ev_ofn_diplomacy_1967','ev_ofn_intervention_africa_1976','ev_oil_crisis_1973','ev_oil_crisis_1975','ev_omsk_black_league','ev_pan_european_movement',
        'ev_peace_accord','ev_plague','ev_political_realignment_1974','ev_pollution_disaster','ev_reconstruction_plan','ev_refugee','ev_rommel_mediation','ev_russia_border_tension',
        'ev_russia_communist_unified','ev_russia_democratic_unified','ev_russia_fascist_unified','ev_russia_final_resolve','ev_russia_komi_taboritsky','ev_russia_madman_unified','ev_russia_magadan','ev_russia_monarchist_unified',
        'ev_russia_nuclear_threat','ev_russia_omsk_black_league','ev_russia_pressure_1979','ev_russia_recovery_1','ev_russia_reunification_threat','ev_russia_unified','ev_saharan_war','ev_samara_vlasov',
        'ev_siberian_black_army','ev_slave_question','ev_somali_ethiopian_war','ev_south_africa_crisis','ev_south_african_war','ev_space_race_1975','ev_spanish_civil_unrest','ev_speer_economic_blueprint',
        'ev_speer_ofn_backchannel','ev_speer_old_guard_resistance','ev_speer_reforms','ev_speer_reforms_deep','ev_speer_slave_reform','ev_speer_student_guard','ev_speer_victory_consolidation','ev_speidal_neutral_zone',
        'ev_speidel_neutral_zone','ev_student_protests_1962','ev_succession_announcement','ev_suez_crisis','ev_sverdlovsk_rokossovsky','ev_technological_revolution','ev_third_world_war_crisis','ev_tomsk_scholar_republic',
        'ev_totalist_spread','ev_triumvirate_formation','ev_triumvirate_fracture','ev_turkey','ev_turkey_colonies','ev_turkey_coup_attempt','ev_turkey_revolt','ev_type_air_show',
        'ev_type_arsenal_explosion','ev_type_art_looting','ev_type_assassination_plot','ev_type_black_market','ev_type_border_clash','ev_type_camp_riot','ev_type_civil_rights','ev_type_codebreaking',
        'ev_type_currency_reform','ev_type_defection','ev_type_diplomatic_crisis','ev_type_diplomatic_wedding','ev_type_economic_crisis','ev_type_espionage','ev_type_food_shortage','ev_type_gas_leak',
        'ev_type_harvest','ev_type_industrial_accident','ev_type_infiltration','ev_type_intelligence_leak','ev_type_mark_devaluation','ev_type_military_mutiny','ev_type_military_parade','ev_type_mine_collapse',
        'ev_type_movie_premiere','ev_type_navy_army_rivalry','ev_type_nuclear_accident','ev_type_nuclear_test','ev_type_occult','ev_type_paranormal','ev_type_plague','ev_type_propaganda',
        'ev_type_religious_conflict','ev_type_rocket_failure','ev_type_satellite_launch','ev_type_slave_auction','ev_type_slave_revolt','ev_type_space_race','ev_type_sports','ev_type_ss_activity',
        'ev_type_state_funeral','ev_type_strike','ev_type_student_protest','ev_type_submarine','ev_type_tech_breakthrough','ev_type_ufo','ev_type_underground','ev_type_warlord',
        'ev_type_weather_anomaly','ev_us_civil_rights_1963','ev_us_civil_rights_1965','ev_us_civil_rights_legacy','ev_us_civil_unrest','ev_us_detente_1980','ev_us_economic_recovery_1972','ev_us_kennedy_assassination',
        'ev_us_new_era','ev_us_ofn_paralysis','ev_us_presidential_election_1968','ev_us_presidential_election_1988','ev_us_race_riots','ev_us_recovery','ev_us_second_civil_war','ev_us_space_program_1975',
        'ev_vyatka_monarchy','ev_war_aftermath','ev_west_russia_remnants','ev_white_international','ev_worker_uprising','ev_ww2_anniversary','rnd_assassination','rnd_coup',
        'rnd_death','rnd_disaster','rnd_election','rnd_festival','rnd_holiday','rnd_parade','rnd_protest','rnd_scandal',
        'rnd_summit','rnd_technical_victory','rnd_wedding',
      ];
      coreList.forEach(id => paths.add('img/events/' + id + '.jpg'));

      // 逐个预加载（低优先级，不阻塞主线程）
      let i = 0;
      const arr = Array.from(paths);
      const next = () => {
        if (i >= arr.length) {
          console.log('[预加载] 事件图片全部缓存完毕: ' + arr.length + ' 张');
          return;
        }
        const img = new Image();
        img.onload = img.onerror = next;
        img.src = arr[i++];
      };
      next();
    }, 500);
  },

  // ===== 快速开始：跳过开场动画，直接进入游戏 =====
  quickStart() {
    if (Game.state && !Game.state.ended) {
      if (!confirm('将丢弃当前进度，快速开始新游戏。确认？')) return;
    }
    // 重置游戏状态
    Game.init();
    // 清除教程弹窗
    const modal = document.getElementById('tutorial-modal');
    if (modal) modal.innerHTML = '';
    // 隐藏开场画面
    const splash = document.getElementById('splash');
    if (splash) splash.style.display = 'none';
    const game = document.getElementById('game');
    if (game) game.classList.add('active');
    // 渲染
    this.renderAll();
    // 预加载事件图片（弹窗秒开）
    this.preloadEventImages();
    // 初始化DataStore
    const initDsPromise = (typeof DataStore !== 'undefined' && DataStore && typeof DataStore.init === 'function')
      ? DataStore.init(Game.state.year)
      : Promise.reject(new Error('no DataStore'));
    initDsPromise.catch(() => {
      this.loadEventsGen().then(ok => {
        if (ok) console.log('[速开] events_gen.js 已就绪');
      });
    });
    // 直接触发开场事件
    setTimeout(() => this.processTurnEvents(), 200);
    this.toast('⚡ 快速开始成功', 'success');
  },

  // ===== 启动游戏 =====
  start(mode) {
    if (mode && GAME_MODES[mode]) {
      Game.setMode(mode);
    }
    Game.init();
    document.getElementById('splash').style.display = 'none';
    document.getElementById('game').classList.add('active');
    this.renderAll();
    // 预加载事件图片（弹窗秒开）
    this.preloadEventImages();
    // 首屏初始化 DataStore (加载 story_core.json + 当前年 + 前后1年随机池 ≈ 380KB+7.8MB ≈ 8.2MB)
    // 替代原先加载整个 84MB events_gen.js 的流程，手机端减少内存~76MB
    const initDsPromise = (typeof DataStore !== 'undefined' && DataStore && typeof DataStore.init === 'function')
      ? DataStore.init(Game.state.year)
      : Promise.reject(new Error('no DataStore'));
    initDsPromise.then(ok => {
      if (ok) {
        const pool = DataStore.getEventPool();
        console.log('[DataStore] 首屏就绪, 当前事件池: ' + pool.length.toLocaleString() + ' 个 (剧情 + ' + (Game.state.year - 1) + '/' + Game.state.year + '/' + (Game.state.year + 1) + ' 年随机)');
      }
    }).catch(() => {
      // DataStore不可用时，退化为旧版懒加载：后台异步加载 84MB 事件库（不阻塞首屏和开场事件）
      this.loadEventsGen().then(ok => {
        if (ok) console.log('[懒加载-兼容] events_gen.js 已就绪 (' + (typeof window.STORY_EVENTS === 'undefined' ? '?' : window.STORY_EVENTS.length.toLocaleString()) + ' 事件)');
      });
    });
    // 触发开场事件
    setTimeout(() => this.processTurnEvents(), 300);
  },

  // ===== 渲染全部 =====
  // ===== 渲染调度 (防抖, 避免短时间多次renderAll卡顿) =====
  _renderTimer: null,
  requestRender() {
    if (this._renderTimer) return; // 已有 pending 渲染, 跳过
    this._renderTimer = requestAnimationFrame(() => {
      this._renderTimer = null;
      this.renderAll();
    });
  },

  renderAll() {
    this.renderTopbar();
    this.renderLeftPanel();
    this.renderRightPanel();
    this.renderTab(this.currentTab);
  },

  // ===== 顶栏 =====
  renderTopbar() {
    const s = Game.state;
    const r = s.resources;
    const income = Game.calculateIncome();

    const fmt = (v) => Math.round(v);
    const fmtDelta = (d) => {
      const v = Math.round(d);
      if (v > 0) return `<span class="delta positive">+${v}</span>`;
      if (v < 0) return `<span class="delta negative">${v}</span>`;
      return '';
    };

    const topbar = document.getElementById('topbar');
    // 缓存策略：第一次用innerHTML建立结构；后续直接用DOM引用更新文本（避免每帧100+节点重建）
    if (!this._topbarCache) {
      const diffInfo = DIFFICULTIES[s.difficulty] || DIFFICULTIES.normal;
      const modeInfo = (typeof GAME_MODES !== 'undefined' && GAME_MODES[s.gameMode]) ? GAME_MODES[s.gameMode] : GAME_MODES.historical;
      topbar.innerHTML = `
        <div class="faction-emblem">大日耳曼国 <span class="diff-tag" style="font-size:10px;color:${diffInfo.color};border:1px solid ${diffInfo.color};padding:1px 5px;border-radius:2px;margin-left:6px">${diffInfo.name}</span><span class="diff-tag" style="font-size:10px;color:${modeInfo.color};border:1px solid ${modeInfo.color};padding:1px 5px;border-radius:2px;margin-left:4px">${modeInfo.icon} ${modeInfo.name}</span></div>
        <div class="leader-info">
          <div>元首</div>
          <div class="leader-name" data-k="leader">${s.leader.name}</div>
          <div style="font-size:10px;color:var(--text-muted)" data-k="title">${s.leader.title || ''}</div>
        </div>
        <div class="resources">
          <div class="resource" title="帝国马克">
            <span class="icon">资金</span>
            <span class="value" data-v="money">${fmt(r.money)}</span>
            <span class="d-money" data-d="money">${fmtDelta(income.money)}</span>
          </div>
          <div class="resource" title="人力">
            <span class="icon">人力</span>
            <span class="value" data-v="manpower">${fmt(r.manpower)}</span>
            <span class="d-manpower" data-d="manpower">${fmtDelta(income.manpower)}</span>
          </div>
          <div class="resource" title="稳定度：只能通过事件恢复，持续衰减">
            <span class="icon">稳定</span>
            <span class="value" data-v="stability">${fmt(r.stability)}</span>
            <span class="d-stability" data-d="stability">${fmtDelta(income.stability)}</span>
          </div>
          <div class="resource" title="威慑：只能通过事件提升，持续衰减">
            <span class="icon">威慑</span>
            <span class="value" data-v="deterrence">${fmt(r.deterrence)}</span>
            <span class="d-deterrence" data-d="deterrence">${fmtDelta(income.deterrence)}</span>
          </div>
          <div class="resource" title="军力：只能通过事件提升，持续衰减">
            <span class="icon">军力</span>
            <span class="value" data-v="militaryPower">${fmt(r.militaryPower)}</span>
            <span class="d-militaryPower" data-d="militaryPower">${fmtDelta(income.militaryPower)}</span>
          </div>
          <div class="resource" title="核慑：只能通过事件提升，持续衰减">
            <span class="icon">核慑</span>
            <span class="value" data-v="nukeDeter">${fmt(r.nukeDeter)}</span>
            <span class="d-nukeDeter" data-d="nukeDeter">${fmtDelta(income.nukeDeter)}</span>
          </div>
          <div class="resource" title="核武器：通过核设施建造，或事件获得">
            <span class="icon">核弹</span>
            <span class="value" data-v="nukes">${fmt(r.nukes)}</span>
          </div>
          <div class="resource" title="研发：只能通过事件获得，持续老化衰减">
            <span class="icon">研发</span>
            <span class="value" data-v="research">${fmt(r.research)}</span>
            <span class="d-research" data-d="research">${fmtDelta(income.research)}</span>
          </div>
        </div>
        <div class="date-block">
          <div class="date" data-k="date">${Game.getDateStr()}</div>
          <div class="turn-info" data-k="turn">回合 ${s.turn} / ${s.totalTurns}</div>
        </div>
        <button class="topbar-map-btn" id="btn-open-map" title="打开世界地图（横屏页面）">🗺 地图</button>
      `;
      // 建立快速引用
      this._topbarCache = {
        vals: {},
        dels: {},
        leader: topbar.querySelector('[data-k="leader"]'),
        title: topbar.querySelector('[data-k="title"]'),
        date: topbar.querySelector('[data-k="date"]'),
        turn: topbar.querySelector('[data-k="turn"]'),
      };
      ['money','manpower','stability','deterrence','militaryPower','nukeDeter','nukes','research'].forEach(k => {
        this._topbarCache.vals[k] = topbar.querySelector(`[data-v="${k}"]`);
        const d = topbar.querySelector(`[data-d="${k}"]`);
        if (d) this._topbarCache.dels[k] = d;
      });
      const _mapBtn = topbar.querySelector('#btn-open-map');
      if (_mapBtn) _mapBtn.onclick = () => this.openMapPage();
      return;
    }

    // 增量更新：只更新数值文本，不重建DOM（性能提升~10x）
    const c = this._topbarCache;
    ['money','manpower','stability','deterrence','militaryPower','nukeDeter','nukes','research'].forEach(k => {
      const newVal = String(fmt(r[k]));
      if (c.vals[k] && c.vals[k].textContent !== newVal) c.vals[k].textContent = newVal;
      if (c.dels[k]) c.dels[k].innerHTML = fmtDelta(income[k]);
    });
    if (c.leader && c.leader.textContent !== s.leader.name) c.leader.textContent = s.leader.name;
    if (c.title && c.title.textContent !== (s.leader.title || '')) c.title.textContent = s.leader.title || '';
    if (c.date) c.date.textContent = Game.getDateStr();
    if (c.turn) c.turn.textContent = `回合 ${s.turn} / ${s.totalTurns}`;
  },

  // ===== 左面板 =====
  renderLeftPanel() {
    const s = Game.state;
    const r = s.resources;
    const rel = s.relations;

    const relLabel = (v) => {
      if (v <= -40) return { cls: 'hostile', text: '敌对' };
      if (v <= -10) return { cls: 'cold', text: '冷淡' };
      if (v <= 10) return { cls: 'neutral', text: '中立' };
      if (v <= 40) return { cls: 'neutral', text: '友好' };
      return { cls: 'friendly', text: '盟友' };
    };

    const relRow = (id) => {
      const v = rel[id];
      const f = FACTIONS[id];
      const lbl = relLabel(v);
      return `<div class="faction-row">
        <span class="fname">${f.short}</span>
        <span class="fval ${lbl.cls}">${v > 0 ? '+' : ''}${v} (${lbl.text})</span>
      </div>`;
    };

    const barHtml = (val, max, cls) => {
      const pct = Math.max(0, Math.min(100, (val / max) * 100));
      return `<div class="bar-track"><div class="bar-fill ${cls}" style="width:${pct}%"></div></div>`;
    };

    document.getElementById('left-panel').innerHTML = `
      <button class="mobile-close-btn" onclick="UI.toggleDrawer('')">✕ 关闭</button>
      <div class="panel-section">
        <h3>国势</h3>
        <div class="section-body">
          <div class="stat-line"><span>稳定度</span><span class="stat-val">${Math.round(r.stability)}/100</span></div>
          ${barHtml(r.stability, 100, 'stab')}
          <div class="stat-line" style="margin-top:6px"><span>综合威慑</span><span class="stat-val">${Math.round(r.deterrence)}/150</span></div>
          ${barHtml(r.deterrence, 150, 'deter')}
          <div class="stat-line" style="margin-top:6px"><span>核威慑</span><span class="stat-val">${Math.round(r.nukeDeter)}/150</span></div>
          ${barHtml(r.nukeDeter, 150, 'nuke')}
          <div class="stat-line" style="margin-top:6px"><span>工业效率</span><span class="stat-val">${(r.efficiency * 100).toFixed(0)}%</span></div>
          ${barHtml(r.efficiency * 50, 100, 'research')}
        </div>
      </div>
      <div class="panel-section">
        <h3>列强关系</h3>
        <div class="section-body">
          ${relRow('ofn')}
          ${relRow('japan')}
          ${relRow('italy')}
          ${relRow('burgundy')}
          ${relRow('russia')}
        </div>
      </div>
      <div class="panel-section">
        <h3>工业</h3>
        <div class="section-body">
          <div class="stat-line"><span>民用建筑</span><span class="stat-val">${this.countBuildings('civilian')}</span></div>
          <div class="stat-line"><span>军用建筑</span><span class="stat-val">${this.countBuildings('military')}</span></div>
          <div class="stat-line"><span>建造中</span><span class="stat-val">${s.buildQueue.length}</span></div>
        </div>
      </div>
      <div class="panel-section">
        <h3>研发</h3>
        <div class="section-body">
          <div class="stat-line"><span>已研科技</span><span class="stat-val">${Object.keys(s.techs).length}</span></div>
          <div class="stat-line"><span>研发点数</span><span class="stat-val">${Math.round(r.research)}</span></div>
        </div>
      </div>
      ${s.chosenPath ? `<div class="panel-section">
        <h3>路线</h3>
        <div class="section-body">
          <div class="stat-line"><span>路线</span><span class="stat-val">${SUCCESSION_PATHS[s.chosenPath]?.title || '—'}</span></div>
          <div class="stat-line"><span>意识形态</span><span class="stat-val">${Game.state.leader.ideology || '—'}</span></div>
        </div>
      </div>` : ''}
    `;
  },

  countBuildings(type) {
    let count = 0;
    for (const id in Game.state.buildings) {
      if (BUILDINGS[id] && BUILDINGS[id].type === type) {
        count += Game.state.buildings[id];
      }
    }
    return count;
  },

  // ===== 右面板 =====
  renderRightPanel() {
    const s = Game.state;
    const newsHtml = s.newsLog.length > 0
      ? s.newsLog.map(n => `
        <div class="news-item ${n.type}">
          <div class="news-date">${n.date}</div>
          <div class="news-text">${n.text}</div>
        </div>`).join('')
      : '<div style="color:var(--text-muted);font-size:12px;padding:12px;text-align:center">暂无新闻</div>';

    document.getElementById('news-ticker').innerHTML = newsHtml;

    document.getElementById('action-bar').innerHTML = `
      <button class="btn-next-turn" id="btn-next-turn">推进至下一季度 ▸</button>
      <button class="btn-secondary" id="btn-save">保存</button>
      <button class="btn-secondary" id="btn-load">读取</button>
      <button class="btn-secondary" id="btn-restart">重启</button>
      ${this.isDebugMode() ? '<button class="btn-secondary" id="btn-debug" style="border-color:var(--accent-gold);color:var(--accent-gold);">DEBUG</button>' : ''}
    `;

    document.getElementById('btn-next-turn').onclick = () => this.nextTurn();
    document.getElementById('btn-save').onclick = () => this.showSavePanel('save');
    document.getElementById('btn-load').onclick = () => this.showSavePanel('load');
    document.getElementById('btn-restart').onclick = () => {
      if (confirm('确定要重新开始吗？当前进度将丢失。')) {
        location.reload();
      }
    };
    const dbgBtn = document.getElementById('btn-debug');
    if (dbgBtn) dbgBtn.onclick = () => this.toggleDebugPanel();

    // 移动端底部操作栏
    this.renderMobileActionBar();
  },

  // ===== 移动端底部操作栏 =====
  renderMobileActionBar() {
    const bar = document.getElementById('mobile-action-bar');
    if (!bar) return;
    // 危机状态指示 (若有核危机)
    const crisis = (typeof NationSim !== 'undefined' && NationSim.getNuclearCrisis) ? NationSim.getNuclearCrisis() : null;
    const crisisBadge = (crisis && crisis.level !== 'low')
      ? `<span style="position:absolute;top:2px;right:2px;width:8px;height:8px;background:${crisis.color};border-radius:50%;box-shadow:0 0 6px ${crisis.color};"></span>`
      : '';
    bar.innerHTML = `
      <button class="mobile-nav-btn" id="m-btn-left" aria-label="势力面板" style="position:relative;">
        <span class="nav-icon">☰</span>
        <span>势力</span>
        ${crisisBadge}
      </button>
      <button class="btn-next-turn" id="m-btn-next">下一季度 ▸</button>
      <button class="mobile-nav-btn" id="m-btn-save" aria-label="存档">
        <span class="nav-icon">💾</span>
        <span>存档</span>
      </button>
      <button class="mobile-nav-btn" id="m-btn-news" aria-label="新闻">
        <span class="nav-icon">📰</span>
        <span>新闻</span>
      </button>
    `;
    document.getElementById('m-btn-next').onclick = () => this.nextTurn();
    document.getElementById('m-btn-left').onclick = () => this.toggleDrawer('left-panel');
    document.getElementById('m-btn-save').onclick = () => this.showSavePanel('save');
    document.getElementById('m-btn-news').onclick = () => this.toggleDrawer('right-panel');

    // 给左右面板各加一个关闭按钮（手机端可见）
    // 注意：left-panel 在 renderLeftPanel 模板中已经自带了，这里只处理 right-panel，
    // 并且为了保险，每次都先清掉旧的再重新添加，确保不会丢失
    ['right-panel'].forEach(id => {
      const panel = document.getElementById(id);
      if (!panel) return;
      // 先移除已有的旧关闭按钮（避免重复）
      const oldBtns = panel.querySelectorAll('.mobile-close-btn');
      oldBtns.forEach(b => b.remove());
      // 在最前面插入新的关闭按钮
      const closeBtn = document.createElement('button');
      closeBtn.className = 'mobile-close-btn';
      closeBtn.innerHTML = '✕ 关闭';
      closeBtn.onclick = () => this.toggleDrawer('');
      panel.insertBefore(closeBtn, panel.firstChild);
    });
  },

  // ===== 抽屉切换（手机端） =====
  toggleDrawer(panelId) {
    const overlay = document.getElementById('drawer-overlay');
    // 先关闭所有
    document.getElementById('left-panel').classList.remove('drawer-open');
    document.getElementById('right-panel').classList.remove('drawer-open');
    overlay.classList.remove('active');
    // 如果传入了有效 panelId，则判断是否要打开
    if (panelId) {
      const panel = document.getElementById(panelId);
      if (panel) {
        panel.classList.add('drawer-open');
        overlay.classList.add('active');
      }
    }
  },

  // ===== 教程/帮助系统 =====
  showTutorial() {
    const modal = document.getElementById('tutorial-modal');
    modal.innerHTML = `
      <div style="position:fixed;inset:0;z-index:1200;background:rgba(0,0,0,0.85);backdrop-filter:blur(4px);display:flex;align-items:flex-start;justify-content:center;padding:16px;overflow-y:auto;" onclick="if(event.target===this){document.getElementById('tutorial-modal').innerHTML='';}">
        <div class="tutorial-modal" style="background:var(--bg-panel);border:1px solid var(--accent-gold);border-radius:4px;max-width:620px;width:100%;max-height:88vh;overflow-y:auto;padding:24px;margin:auto;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:12px;">
            <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);font-size:20px;letter-spacing:0.1em;">帝国操作手册</h2>
            <button onclick="document.getElementById('tutorial-modal').innerHTML='';" style="background:none;border:none;color:var(--text-muted);font-size:24px;cursor:pointer;line-height:1;">×</button>
          </div>

          <div style="color:var(--text-secondary);font-size:13px;line-height:1.8;">

            <div style="background:linear-gradient(135deg,rgba(232,200,96,0.06),rgba(168,50,50,0.04));border-left:3px solid var(--accent-gold);padding:12px 14px;margin:8px 0 14px;border-radius:0 4px 4px 0;">
              <strong style="color:var(--accent-gold-bright);">你的使命：</strong>
              从 1962 年起掌控大日耳曼国，穿越 38 年的风暴，在 <strong>希特勒之死、内战、核危机</strong> 等关键节点做出抉择，带领帝国走向 15 种结局之一。
            </div>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:14px 0 8px;font-size:15px;letter-spacing:0.05em;">① 八项资源</h3>
            <p style="margin-bottom:6px;">顶部状态栏是帝国的脉搏，每季度自动结算：</p>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px 14px;margin:6px 0 10px;">
              <div><span style="color:#e8c860;">💰 资金</span> — 建造/研发/采购的基础，民工业产出</div>
              <div><span style="color:#4fa3e8;">👥 人力</span> — 建造所需，住宅与农业产出</div>
              <div><span style="color:#e07070;">⚖ 稳定</span> — <strong style="color:#e74c3c;">≤0 立刻崩溃</strong>，结局关键</div>
              <div><span style="color:#c87830;">⚔ 威慑</span> — 综合国力，<strong style="color:#e74c3c;">过低会被入侵</strong></div>
              <div><span style="color:#d06060;">🛡 军力</span> — 常规战力，兵工厂产出</div>
              <div><span style="color:#b040b0;">☢ 核慑</span> — 核威慑力，核设施产出</div>
              <div><span style="color:#a040a0;">💣 核弹</span> — 终极威慑，数量决定存亡</div>
              <div><span style="color:#50c0a0;">🔬 研发</span> — 科技点数，研发中心产出</div>
            </div>
            <p style="font-size:12px;color:var(--text-muted);">括号中的 <span style="color:var(--accent-toxic);">+X</span> / <span style="color:var(--accent-blood-bright);">-X</span> 是每季度自动变化量。</p>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:16px 0 8px;font-size:15px;letter-spacing:0.05em;">② 标签页导航</h3>
            <div style="display:grid;gap:8px;margin:6px 0;">
              <div style="background:var(--bg-elevated);padding:8px 12px;border-radius:4px;border-left:2px solid #c8a040;">
                <strong>📊 帝国概览</strong> — 全局状态、外交关系、产出明细
              </div>
              <div style="background:var(--bg-elevated);padding:8px 12px;border-radius:4px;border-left:2px solid #6080b0;">
                <strong>🏭 工业建设</strong> — 核心玩法。<span style="color:#60a0e0;">民工业</span>保经济，<span style="color:#e06060;">军工业</span>保生存
              </div>
              <div style="background:var(--bg-elevated);padding:8px 12px;border-radius:4px;border-left:2px solid #b07040;">
                <strong>📜 国策政策</strong> — 立法改革决定路线，<strong>奴隶制存废、军事改革</strong>等
              </div>
              <div style="background:var(--bg-elevated);padding:8px 12px;border-radius:4px;border-left:2px solid #50c0a0;">
                <strong>🔬 科技研发</strong> — 四大科技树×五个时代，消耗研发点获永久增益
              </div>
              <div style="background:var(--bg-elevated);padding:8px 12px;border-radius:4px;border-left:2px solid #8050a0;">
                <strong>🛒 黑市商店</strong> — 应急救场：维稳拨款、雇佣兵、核材料、帝国债券
              </div>
              <div style="background:var(--bg-elevated);padding:8px 12px;border-radius:4px;border-left:2px solid #a08050;">
                <strong>🌍 势力面板</strong> — GDP、人口、国力排名，监控各超级大国动向
              </div>
              <div style="background:var(--bg-elevated);padding:8px 12px;border-radius:4px;border-left:2px solid #606060;">
                <strong>📰 新闻简报</strong> — 世界大事日志，了解局势变化
              </div>
            </div>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:16px 0 8px;font-size:15px;letter-spacing:0.05em;">③ 工业建设进阶</h3>
            <p style="margin-bottom:4px;">两类建筑互为表里，不可偏废：</p>
            <div style="background:rgba(60,100,160,0.08);border:1px solid rgba(96,160,224,0.2);padding:10px 14px;border-radius:4px;margin:6px 0;">
              <strong style="color:#60a0e0;">民工业（蓝框）</strong>
              <div style="font-size:12px;margin-top:4px;color:var(--text-secondary);">
                消费品工厂→资金 · 工人住宅区→人力+稳定 · 研发中心→研发 · 基础设施→降低建造成本 · 农业综合体→人力
              </div>
            </div>
            <div style="background:rgba(160,60,60,0.08);border:1px solid rgba(224,96,96,0.2);padding:10px 14px;border-radius:4px;margin:6px 0;">
              <strong style="color:#e06060;">军工业（红框）</strong>
              <div style="font-size:12px;margin-top:4px;color:var(--text-secondary);">
                兵工厂→军力 · 核武器设施→核弹+核慑 · 奇迹武器实验室→高级研发 · 国土防空网→防御+威慑
              </div>
            </div>
            <div style="background:rgba(232,200,96,0.08);padding:8px 12px;border-radius:2px;font-size:12px;margin-top:8px;">
              <strong style="color:var(--accent-gold-bright);">进阶技巧：</strong>
              基础设施越多，后续建筑越便宜。前期建议先造 3-5 个基础设施 + 消费品工厂打底，再转军工业。
            </div>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:16px 0 8px;font-size:15px;letter-spacing:0.05em;">④ 关键剧情节点</h3>
            <div style="display:flex;flex-direction:column;gap:8px;margin:6px 0;">
              <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="background:rgba(232,80,80,0.2);color:#e85050;padding:2px 8px;border-radius:3px;font-size:11px;white-space:nowrap;font-weight:bold;">1963</span>
                <div><strong>希特勒之死</strong> — 选择继任者：<span style="color:#60a0e0;">施佩尔</span>·<span style="color:#b07040;">鲍曼</span>·<span style="color:#a04040;">戈林</span>·<span style="color:#404040;">海德里希</span>，<strong>决定四条路线</strong></div>
              </div>
              <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="background:rgba(200,100,40,0.2);color:#e07030;padding:2px 8px;border-radius:3px;font-size:11px;white-space:nowrap;font-weight:bold;">1963-65</span>
                <div><strong>德国内战</strong> — 希姆莱的勃艮第可能窃取核武器，<strong>需足够军力平叛</strong></div>
              </div>
              <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="background:rgba(120,80,200,0.2);color:#a070e0;padding:2px 8px;border-radius:3px;font-size:11px;white-space:nowrap;font-weight:bold;">1989</span>
                <div><strong>核危机</strong> — 午夜差一分钟，<strong>核弹+核慑是否足够</strong>决定存亡</div>
              </div>
              <div style="display:flex;gap:10px;align-items:flex-start;">
                <span style="background:rgba(232,200,96,0.2);color:#e8c860;padding:2px 8px;border-radius:3px;font-size:11px;white-space:nowrap;font-weight:bold;">2000</span>
                <div><strong>终局来临</strong> — 根据路线、稳定、威慑、核弹综合判定结局</div>
              </div>
            </div>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:16px 0 8px;font-size:15px;letter-spacing:0.05em;">⑤ 操作速查</h3>
            <ul style="margin:6px 0 6px 18px;line-height:2;">
              <li><strong>推进回合：</strong>电脑按 <code style="background:var(--bg-elevated);padding:1px 6px;border-radius:2px;">空格</code>，手机点底部按钮</li>
              <li><strong>存档：</strong>右上角存档按钮，或自动保存到浏览器本地</li>
              <li><strong>事件选择：</strong>必须点击选项才能继续，每个选择影响资源和剧情</li>
              <li><strong>帝国崩溃：</strong>稳定 ≤ 0 <span style="color:#e74c3c;">立即游戏结束</span></li>
              <li><strong>外敌入侵：</strong>威慑 <span style="color:#e74c3c;">低于 10</span> 可能被宣战</li>
            </ul>

            <h3 style="color:var(--accent-gold);font-family:var(--font-serif);margin:16px 0 8px;font-size:15px;letter-spacing:0.05em;">⑥ 新手指引</h3>
            <div style="background:rgba(74,138,74,0.08);padding:10px 14px;border-radius:4px;font-size:12px;line-height:1.9;">
              <p style="margin:0 0 6px;"><strong>第一年（1962）：</strong>先造 <span style="color:#60a0e0;">消费品工厂</span> 和 <span style="color:#60a0e0;">基础设施</span>，保证资金+10以上。</p>
              <p style="margin:0 0 6px;"><strong>希特勒死前：</strong>至少积累 <span style="color:#e06060;">军力 ≥ 30</span>，否则内战难平。</p>
              <p style="margin:0 0 6px;"><strong>1970年代：</strong>开始造 <span style="color:#e06060;">核武器设施</span>，1989核危机前核弹 ≥ 5 较安全。</p>
              <p style="margin:0;"><strong>资金紧张时：</strong>去商店发 <strong>帝国债券</strong>（换 120 资金，5 年后还本金+利息，利率随难度变化）。</p>
            </div>

          </div>

          <button onclick="document.getElementById('tutorial-modal').innerHTML='';" style="display:block;width:100%;margin-top:20px;padding:12px;background:linear-gradient(180deg,rgba(168,50,50,0.25),rgba(168,50,50,0.08));border:1px solid var(--accent-blood);color:var(--accent-gold-bright);font-family:var(--font-serif);font-size:15px;letter-spacing:0.15em;cursor:pointer;border-radius:2px;">Jawohl!</button>
        </div>
      </div>
    `;
  },

  // ===== 标签页内容 =====
  renderTab(tab) {
    this.currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));

    const content = document.getElementById('tab-content');
    // 保存滚动位置，商店内部切换对话/菜单时保持不跳
    const savedScroll = (tab === 'shop') ? content.scrollTop : null;
    const savedMenuScroll = (tab === 'shop') ? (content.querySelector('.shop-menu-list')?.scrollTop || 0) : null;
    switch (tab) {
      case 'overview':
        content.innerHTML = this.renderOverview();
        break;
      case 'nation':
        content.innerHTML = this.renderNation();
        break;
      case 'world':
        content.innerHTML = this.renderWorld();
        this._bindWorld();
        break;
      case 'map':
        this._mapPostRenderBound = false;
        if (!this._tabCache.map || Game.state._dirtyMap) {
          content.innerHTML = this.renderMap();
          this._tabCache.map = { html: content.innerHTML };
          delete Game.state._dirtyMap;
        } else {
          content.innerHTML = this._tabCache.map.html;
        }
        this._bindMapPostRender.bind(this)();
        // 绑定势力卡片点击 → 外交面板
        const UI = this;
        content.querySelectorAll('.faction-clickable[data-faction]').forEach(card => {
          card.onclick = () => {
            const fid = card.dataset.faction;
            if (fid) UI._showDiplomacyPanel(fid);
          };
        });
        break;
      case 'industry':
        content.innerHTML = this.renderIndustry();
        break;
      case 'policy':
        content.innerHTML = this.renderPolicy();
        this._tabCache.policy = { html: content.innerHTML };
        break;
      case 'tech':
        content.innerHTML = this.renderTech();
        this._tabCache.tech = { html: content.innerHTML };
        break;
      case 'shop':
        content.innerHTML = this.renderShop();
        this._tabCache.shop = { html: content.innerHTML };
        this.bindShopEvents();
        // 恢复滚动位置，避免点击菜单后页面跳到对话框
        if (savedScroll !== null) {
          requestAnimationFrame(() => {
            content.scrollTop = savedScroll;
            const ml = content.querySelector('.shop-menu-list');
            if (ml && savedMenuScroll !== null) ml.scrollTop = savedMenuScroll;
          });
        }
        break;
      case 'events':
        content.innerHTML = this.renderEventLog();
        this._tabCache.events = { html: content.innerHTML };
        break;
    }
    if (tab === 'shop' && !this._tabCache.shop) {
      this.bindShopEvents();
    }
  },

  // 地图渲染后的后处理：间隙、分区按钮 + Canvas初始化 + 渲染器/层级切换
  _bindMapPostRender() {
    const UI = this;
    if (this._mapPostRenderBound) return;
    this._mapPostRenderBound = true;

    setTimeout(() => {
      const container = document.querySelector('.map-container');
      if (!container) return;

      // 清理旧实例
      if (UI._svgMapInstance) { UI._svgMapInstance.destroy(); UI._svgMapInstance = null; }
      if (UI._canvasMapInstance) { UI._canvasMapInstance.destroy(); UI._canvasMapInstance = null; }

      const canvas = document.getElementById('tno-map-canvas');
      if (!canvas || typeof SVGMap === 'undefined') return;

      // 创建tooltip
      const tooltip = document.createElement('div');
      tooltip.id = 'tno-map-tooltip';
      tooltip.style.cssText = 'position:absolute;pointer-events:none;background:rgba(10,14,22,0.92);border:1px solid #4a4030;color:#f0e8c8;padding:4px 8px;border-radius:3px;font-size:11px;line-height:1.4;white-space:nowrap;display:none;z-index:5;box-shadow:0 2px 8px rgba(0,0,0,0.6);';
      container.appendChild(tooltip);

      const selector = document.getElementById('tno-map-selector');
      const lastMap = (function(){ try { return localStorage.getItem('tno_last_map') || 'einheitspakt'; } catch(_){ return 'einheitspakt'; } })();
      if (selector) selector.value = lastMap;

      UI._svgMapInstance = new SVGMap(canvas, {
        dataDir: 'data/svg_maps',
        autoLoad: false,
      });

      UI._svgMapInstance.on('hover', (evt) => {
        const f = evt && evt.feature;
        if (!f) { tooltip.style.display = 'none'; return; }
        const rect = container.getBoundingClientRect();
        tooltip.innerHTML = `<b>${f.zh}</b><br><span style="color:#a0a0b0">ID: ${f.id}</span>`;
        tooltip.style.left = Math.min(rect.width - 80, evt.x - rect.left + 12) + 'px';
        tooltip.style.top = Math.min(rect.height - 40, evt.y - rect.top + 12) + 'px';
        tooltip.style.display = 'block';
      });
      UI._svgMapInstance.on('hoverout', () => { tooltip.style.display = 'none'; });
      UI._svgMapInstance.on('click', (evt) => {
        const f = evt && evt.feature;
        if (f) UI.toast(`${f.zh} [${f.id}]`, 'info');
      });

      UI._svgMapInstance.loadMap(lastMap);

      // 地图选择器
      if (selector) {
        selector.onchange = () => {
          const mapId = selector.value;
          try { localStorage.setItem('tno_last_map', mapId); } catch(_) {}
          if (UI._svgMapInstance) UI._svgMapInstance.loadMap(mapId);
        };
      }

      // 缩放按钮
      const btnZoomIn = document.getElementById('btn-zoom-in');
      const btnZoomOut = document.getElementById('btn-zoom-out');
      const btnFit = document.getElementById('btn-zoom-fit');
      if (btnZoomIn && !btnZoomIn._bound) {
        btnZoomIn._bound = true;
        btnZoomIn.addEventListener('click', () => {
          if (UI._svgMapInstance) UI._svgMapInstance.zoomBy(1.4);
        });
      }
      if (btnZoomOut && !btnZoomOut._bound) {
        btnZoomOut._bound = true;
        btnZoomOut.addEventListener('click', () => {
          if (UI._svgMapInstance) UI._svgMapInstance.zoomBy(1 / 1.4);
        });
      }
      if (btnFit && !btnFit._bound) {
        btnFit._bound = true;
        btnFit.addEventListener('click', () => {
          if (UI._svgMapInstance) UI._svgMapInstance.zoomToFit();
        });
      }

      // 全屏按钮（优先 Fullscreen API，失败则伪全屏 fixed）
      const btnFS = document.getElementById('btn-fullscreen-map');
      const mapPageRoot = document.getElementById('map-page-root');
      function _exitFullscreen() {
        try {
          if (document.fullscreenElement) {
            document.exitFullscreen();
            return;
          }
        } catch (_) {}
        mapPageRoot && mapPageRoot.classList.remove('map-fullscreen-mode');
        btnFS && (btnFS.textContent = '⛶ 全屏');
        setTimeout(() => UI._svgMapInstance && UI._svgMapInstance.zoomToFit(), 120);
      }
      function _enterFullscreen() {
        let usedRealFS = false;
        try {
          const target = document.documentElement || mapPageRoot;
          if (target && typeof target.requestFullscreen === 'function'
              && document.fullscreenEnabled !== false) {
            target.requestFullscreen().catch(() => {
              // Fullscreen API 被拒绝（iframe/权限），降级伪全屏
              mapPageRoot && mapPageRoot.classList.add('map-fullscreen-mode');
              btnFS && (btnFS.textContent = '✕ 退出全屏');
              setTimeout(() => UI._svgMapInstance && UI._svgMapInstance.zoomToFit(), 120);
            });
            usedRealFS = true;
          }
        } catch (_) { usedRealFS = false; }
        if (!usedRealFS) {
          mapPageRoot && mapPageRoot.classList.add('map-fullscreen-mode');
          btnFS && (btnFS.textContent = '✕ 退出全屏');
          setTimeout(() => UI._svgMapInstance && UI._svgMapInstance.zoomToFit(), 120);
        }
        btnFS && (btnFS.textContent = '✕ 退出全屏');
      }
      // 监听真实全屏变化，同步按钮文字和伪全屏状态
      if (!UI._fsChangeListener) {
        UI._fsChangeListener = () => {
          if (!document.fullscreenElement
              && mapPageRoot && !mapPageRoot.classList.contains('map-fullscreen-mode')) {
            btnFS && (btnFS.textContent = '⛶ 全屏');
          }
        };
        document.addEventListener('fullscreenchange', UI._fsChangeListener);
      }
      if (btnFS && !btnFS._bound) {
        btnFS._bound = true;
        btnFS.addEventListener('click', () => {
          const fsActive = (document.fullscreenElement)
            || (mapPageRoot && mapPageRoot.classList.contains('map-fullscreen-mode'));
          if (fsActive) _exitFullscreen(); else _enterFullscreen();
        });
        // ESC 退出伪全屏
        document.addEventListener('keydown', function onKey(e) {
          if (e.key === 'Escape'
              && mapPageRoot && mapPageRoot.classList.contains('map-fullscreen-mode')) {
            _exitFullscreen();
          }
        });
      }

    }, 0);
  },

  // ===== 独立横屏地图页面 =====
  openMapPage() {
    const overlay = document.getElementById('map-overlay-page');
    if (!overlay) return;
    overlay.innerHTML = this.renderMapPage();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // 重置绑定标志，强制重新绑定 canvas/缩放/选择器
    this._mapPostRenderBound = false;
    this._bindMapPostRender();
    // 绑定势力卡片点击 → 外交面板 (独立于地图canvas初始化，确保始终生效)
    const UI = this;
    overlay.querySelectorAll('.faction-clickable[data-faction]').forEach(card => {
      card.onclick = () => {
        const fid = card.dataset.faction;
        if (fid) UI._showDiplomacyPanel(fid);
      };
    });
    // 关闭按钮
    const btnClose = document.getElementById('btn-close-map');
    if (btnClose) btnClose.onclick = () => this.closeMapPage();
    // ESC 关闭（只绑一次）
    if (!this._mapOverlayEscBound) {
      this._mapOverlayEscBound = true;
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          const ov = document.getElementById('map-overlay-page');
          if (ov && ov.classList.contains('active')) this.closeMapPage();
        }
      });
    }
  },

  closeMapPage() {
    const overlay = document.getElementById('map-overlay-page');
    if (!overlay) return;
    // 销毁地图实例释放资源
    if (this._svgMapInstance) { try { this._svgMapInstance.destroy(); } catch(_) {} this._svgMapInstance = null; }
    if (this._canvasMapInstance) { try { this._canvasMapInstance.destroy(); } catch(_) {} this._canvasMapInstance = null; }
    this._mapPostRenderBound = false;
    overlay.classList.remove('active');
    overlay.innerHTML = '';
    document.body.style.overflow = '';
  },

  renderMapPage() {
    const s = Game.state || { flags: {}, relations: {}, turn: 1, totalTurns: 156 };
    const mapNames = (typeof SVGMap !== 'undefined' && SVGMap.MAP_NAMES) ? SVGMap.MAP_NAMES : {
      einheitspakt: '轴心国集团（欧洲）', america: '美洲', geacs: '大东亚共荣圈',
      russia: '俄罗斯地区', south_asia: '南亚/中东', triumvirate: '三头同盟（地中海）',
      einheitspakt_afrika: '轴心非洲', west_africa: '西非', antarctica: '南极洲',
    };
    const lastMap = (function(){ try { return localStorage.getItem('tno_last_map') || 'einheitspakt'; } catch(_){ return 'einheitspakt'; } })();
    const options = Object.entries(mapNames).map(([id, name]) =>
      `<option value="${id}"${id === lastMap ? ' selected' : ''}>${name}</option>`
    ).join('');

    return `
      <div class="map-overlay-inner">
        <div class="map-overlay-toolbar">
          <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);letter-spacing:0.1em;font-size:15px;margin:0;white-space:nowrap;">TNO 世界地图</h2>
          <div class="map-overlay-controls">
            <select id="tno-map-selector" style="padding:4px 10px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;font-size:12px;cursor:pointer;">${options}</select>
            <button id="btn-zoom-out" style="width:32px;height:28px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;cursor:pointer;font-size:16px;font-weight:bold;display:flex;align-items:center;justify-content:center;" title="缩小">−</button>
            <button id="btn-zoom-fit" style="padding:4px 10px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;cursor:pointer;font-size:12px;" title="重置视图">⤢</button>
            <button id="btn-zoom-in" style="width:32px;height:28px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;cursor:pointer;font-size:16px;font-weight:bold;display:flex;align-items:center;justify-content:center;" title="放大">+</button>
            <span style="font-size:12px;color:var(--text-muted);margin-left:6px;white-space:nowrap;">${Game.getDateStr()} · 回合 ${s.turn}/${s.totalTurns}</span>
            <button id="btn-close-map" style="margin-left:10px;padding:4px 14px;background:rgba(120,40,40,0.6);color:#f0d0d0;border:1px solid #8a3a3a;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;" title="关闭地图">✕ 关闭</button>
          </div>
        </div>
        <div class="map-overlay-stage">
          <div class="map-container" style="width:100%;height:100%;background:#0e1520;border-radius:4px;overflow:hidden;">
            <canvas id="tno-map-canvas" style="width:100%;height:100%;display:block;touch-action:none;cursor:grab;"></canvas>
          </div>
        </div>
        <div class="map-overlay-factions">
          <div style="font-family:var(--font-serif);color:var(--accent-gold);letter-spacing:0.1em;font-size:12px;padding:8px 14px 4px;flex-shrink:0;">势力关系 <span style="color:var(--text-muted);font-size:10px">（点击势力进行外交）</span></div>
          <div class="map-overlay-factions-list">${this._renderFactionCards()}</div>
        </div>
      </div>
    `;
  },

  // ===== 渲染势力卡片 (地图页与全屏地图共用) =====
  _renderFactionCards() {
    const s = Game.state || { flags: {}, relations: {} };
    const f = s.flags || {};

    const germanyColor = f.civil_war_imminent && !f.civil_war_over ? '#6a2a2a' : '#a83232';
    const germanyLabel = f.civil_war_imminent && !f.civil_war_over ? '大日耳曼国（内战）' : '大日耳曼国';
    const italyColor = f.italy_accepted || f.italy_leaves_sphere ? '#3a6a3a' : '#5a8a4a';
    const italyLabel = f.italy_accepted ? '意大利（已脱离）' : '意大利（三头同盟）';
    const burgundyColor = '#4a2a4a';
    const iberiaColor = f.iberian_collapse ? '#6a5a3a' : '#8a7a4a';

    let russiaColor = '#3a3a3a';
    let russiaLabel = '俄罗斯（分裂）';
    let russiaFragments = true;
    if (f.russia_democratic) { russiaColor = '#3a7a5a'; russiaLabel = '俄罗斯共和国'; russiaFragments = false; }
    else if (f.russia_communist) { russiaColor = '#8a2a2a'; russiaLabel = '新苏联'; russiaFragments = false; }
    else if (f.russia_fascist) { russiaColor = '#5a3a3a'; russiaLabel = '俄罗斯民族国'; russiaFragments = false; }
    else if (f.russia_madman) { russiaColor = '#2a2a2a'; russiaLabel = '摄政俄罗斯（疯狂）'; russiaFragments = false; }
    else if (f.russia_monarchist) { russiaColor = '#4a4a8a'; russiaLabel = '俄罗斯帝国'; russiaFragments = false; }

    const factionDetails = [
      { id: null, name: '大日耳曼国', rel: null, desc: germanyLabel, color: germanyColor, isPlayer: true },
      { id: 'ofn', name: '美国 (OFN)', rel: s.relations.ofn, desc: '自由世界残部，民主灯塔', color: '#3a5a8a' },
      { id: 'japan', name: '日本', rel: s.relations.japan, desc: '共荣圈霸主，太平洋帝国', color: '#8a7a3a' },
      { id: 'italy', name: '意大利', rel: s.relations.italy, desc: italyLabel, color: italyColor },
      { id: 'burgundy', name: '勃艮第', rel: s.relations.burgundy, desc: '希姆莱的黑暗国度', color: burgundyColor },
      ...(russiaFragments ? [
        { id: 'russia', name: '俄罗斯（军阀割据）', rel: s.relations.russia, desc: '群雄割据，前途未卜', color: russiaColor },
      ] : [
        { id: 'russia', name: russiaLabel, rel: s.relations.russia, desc: '已统一的东方巨人', color: russiaColor },
      ]),
    ];

    const satelliteStates = [
      { name: '奥地利', color: '#6a5a7a' }, { name: '捷克斯洛伐克', color: '#7a6a5a' },
      { name: '匈牙利', color: '#7a5a5a' }, { name: '罗马尼亚', color: '#7a5a4a' },
      { name: '保加利亚', color: '#6a4a5a' }, { name: '希腊', color: '#5a6a7a' },
      { name: '伊比利亚', color: iberiaColor },
    ];

    const relText = (v) => v === null ? '—' : v <= -40 ? '敌对' : v <= -10 ? '冷淡' : v <= 10 ? '中立' : v <= 40 ? '友好' : '盟友';
    const relColor = (v) => v === null ? 'var(--text-muted)' : v <= -40 ? 'var(--accent-blood-bright)' : v <= -10 ? '#c97a3a' : v <= 10 ? 'var(--text-muted)' : v <= 40 ? 'var(--accent-toxic)' : 'var(--accent-gold-bright)';

    const factionHtml = factionDetails.map(fd => `
      <div class="faction-detail-card${fd.id ? ' faction-clickable' : ''}"${fd.id ? ` data-faction="${fd.id}"` : ''}>
        <div class="fdc-color" style="background:${fd.color}"></div>
        <div class="fdc-info"><div class="fdc-name">${fd.name}</div><div class="fdc-desc">${fd.desc}</div></div>
        <div class="fdc-rel" style="color:${relColor(fd.rel)}">${relText(fd.rel)}${fd.rel !== null ? ` ${fd.rel > 0 ? '+' : ''}${fd.rel}` : ''}</div>
      </div>`).join('');

    const satelliteHtml = `
      <div class="satellite-group" style="margin-top:12px;padding:10px 12px;background:var(--bg-panel);border:1px solid var(--border);border-left:3px solid var(--accent-steel);border-radius:2px;">
        <div style="font-family:var(--font-serif);color:var(--accent-gold);margin-bottom:6px;letter-spacing:0.1em;font-size:12px">帝国卫星国 / 傀儡国</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${satelliteStates.map(st => `<div style="display:flex;align-items:center;gap:4px;padding:3px 8px;background:rgba(255,255,255,0.03);border:1px solid var(--border);border-radius:2px;font-size:10px;color:var(--text-secondary)"><span style="display:inline-block;width:8px;height:8px;background:${st.color};border-radius:1px"></span>${st.name}</div>`).join('')}
        </div>
      </div>`;

    return factionHtml + satelliteHtml;
  },

  // ===== 势力地图页 =====
  renderMap() {
    const s = Game.state || { flags: {}, relations: {}, turn: 1, totalTurns: 156 };
    const f = s.flags || {};

    // 势力卡片 + 卫星国 (复用共享渲染逻辑)
    const factionHtml = this._renderFactionCards();
    const satelliteHtml = '';

    const timelineHtml = this.renderTimeline();

    // 地图选择器选项
    const mapNames = (typeof SVGMap !== 'undefined' && SVGMap.MAP_NAMES) ? SVGMap.MAP_NAMES : {
      einheitspakt: '轴心国集团（欧洲）', america: '美洲', geacs: '大东亚共荣圈',
      russia: '俄罗斯地区', south_asia: '南亚/中东', triumvirate: '三头同盟（地中海）',
      einheitspakt_afrika: '轴心非洲', west_africa: '西非', antarctica: '南极洲',
    };
    const lastMap = (function(){ try { return localStorage.getItem('tno_last_map') || 'einheitspakt'; } catch(_){ return 'einheitspakt'; } })();
    const options = Object.entries(mapNames).map(([id, name]) =>
      `<option value="${id}"${id === lastMap ? ' selected' : ''}>${name}</option>`
    ).join('');

    return `
      <div class="map-page" id="map-page-root">
        <div class="map-header">
          <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);letter-spacing:0.1em">TNO 世界地图</h2>
          <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
            <select id="tno-map-selector" style="padding:4px 10px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;font-size:12px;cursor:pointer;">${options}</select>
            <button id="btn-zoom-out" style="width:32px;height:28px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;cursor:pointer;font-size:16px;font-weight:bold;display:flex;align-items:center;justify-content:center;" title="缩小">−</button>
            <button id="btn-zoom-fit" style="padding:4px 10px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;cursor:pointer;font-size:12px;" title="重置视图">⤢</button>
            <button id="btn-zoom-in" style="width:32px;height:28px;background:rgba(30,35,50,0.8);color:#c0c8d0;border:1px solid #4a5a6a;border-radius:4px;cursor:pointer;font-size:16px;font-weight:bold;display:flex;align-items:center;justify-content:center;" title="放大">+</button>
            <button id="btn-fullscreen-map" style="padding:4px 10px;background:rgba(50,40,60,0.8);color:#d8c0f0;border:1px solid #6a5a8a;border-radius:4px;cursor:pointer;font-size:13px;font-weight:bold;" title="全屏显示地图">⛶ 全屏</button>
            <div style="font-size:12px;color:var(--text-muted);margin-left:8px">${Game.getDateStr()} · 回合 ${s.turn}/${s.totalTurns}</div>
          </div>
        </div>
        <div class="map-container" style="width:100%;background:#0e1520;border-radius:4px;overflow:hidden;">
          <canvas id="tno-map-canvas" style="width:100%;height:100%;display:block;touch-action:none;cursor:grab;"></canvas>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:6px;text-align:center;flex-shrink:0;">滚轮缩放 · 拖拽平移 · 点击国家查看详情 · 矢量地图 by lilaui (CC-BY-SA 3.0)</div>
        <div class="map-factions" style="flex-shrink:0;">${factionHtml}${satelliteHtml}</div>
        <div class="map-timeline-section" style="flex-shrink:0;">
          <h3 style="font-family:var(--font-serif);color:var(--accent-gold);letter-spacing:0.1em;margin-bottom:10px">历史进程</h3>
          ${timelineHtml}
        </div>
      </div>
    `;
  },

  // ===== 外交面板 =====
  // ===== 通用模态框 =====
  showModal(title, html) {
    const modal = document.getElementById('event-modal');
    if (!modal) return;
    modal.innerHTML = `
      <div class="modal-box">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:10px;">
          <div style="font-family:var(--font-serif);font-size:15px;color:var(--accent-gold-bright);letter-spacing:0.08em">${title}</div>
          <button class="btn" id="modal-close-btn" style="padding:4px 10px;font-size:12px">✕ 关闭</button>
        </div>
        <div class="modal-body" style="max-height:60vh;overflow-y:auto">${html}</div>
      </div>
    `;
    modal.classList.add('active');
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('active'); };
  },

  _showDiplomacyPanel(factionId) {
    const s = Game.state;
    const FACTIONS = (typeof _getFactions === 'function') ? _getFactions() : {};
    const fdata = FACTIONS[factionId];
    if (!fdata) { this.toast('势力数据不存在', 'error'); return; }
    const rel = s.relations[factionId] || 0;
    const r = s.resources;
    const relText = rel <= -40 ? '敌对' : rel <= -10 ? '冷淡' : rel <= 10 ? '中立' : rel <= 40 ? '友好' : '盟友';
    const relColor = rel <= -40 ? 'var(--accent-blood-bright)' : rel <= -10 ? '#c97a3a' : rel <= 10 ? 'var(--text-muted)' : rel <= 40 ? 'var(--accent-toxic)' : 'var(--accent-gold-bright)';

    const actions = [
      { id: 'improve', name: '改善关系', icon: '🤝', cost: '💰30', desc: '派遣外交使团，改善双边关系 (+8)', canAfford: r.money >= 30 },
      { id: 'trade', name: '贸易协定', icon: '📋', cost: '💰50', desc: '签订贸易协定，获💰40回报并改善关系 (+5)', canAfford: r.money >= 50 },
      { id: 'pressure', name: '外交施压', icon: '⚔️', cost: '💰20 威慑3', desc: '利用威慑施压，恶化关系(-10)但稳定+2', canAfford: r.money >= 20 && r.deterrence >= 3 },
      { id: 'intrigue', name: '秘密行动', icon: '🕵️', cost: '💰60 研发10', desc: '派遣特工破坏，大幅恶化关系(-15)但获研发+8', canAfford: r.money >= 60 && r.research >= 10 },
    ];

    const actionsHtml = actions.map(a => `
      <button class="btn btn-build diplo-action-btn" data-diplo-action="${a.id}" ${a.canAfford ? '' : 'disabled'}
        style="display:flex;align-items:center;gap:8px;width:100%;text-align:left;padding:10px 12px;margin-bottom:6px;${a.canAfford ? '' : 'opacity:0.4;'}">
        <span style="font-size:18px">${a.icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;color:var(--text-primary)">${a.name}</div>
          <div style="font-size:10px;color:var(--text-muted)">${a.desc}</div>
        </div>
        <div style="font-size:10px;color:var(--accent-gold);white-space:nowrap">${a.cost}</div>
      </button>`).join('');

    const html = `
      <div style="padding:16px;max-width:500px;margin:0 auto">
        <div style="text-align:center;margin-bottom:16px">
          <div style="font-family:var(--font-serif);font-size:18px;color:var(--accent-gold-bright);letter-spacing:0.08em">${fdata.name}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:4px;line-height:1.5">${fdata.desc}</div>
          <div style="margin-top:10px;padding:6px 14px;display:inline-block;border:1px solid var(--border);border-radius:4px;background:var(--bg-panel)">
            <span style="font-size:11px;color:var(--text-muted)">关系: </span>
            <span style="font-size:14px;color:${relColor};font-weight:bold">${relText} ${rel > 0 ? '+' : ''}${rel}</span>
          </div>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;text-align:center;border-top:1px solid var(--border);padding-top:10px">
          友好关系 → 贸易收入加成 · 敌对关系 → 军费开支增加
        </div>
        <div>${actionsHtml}</div>
      </div>`;

    this.showModal('外交: ' + fdata.short, html);
    const modal = document.getElementById('event-modal');
    if (modal) {
      modal.querySelectorAll('[data-diplo-action]').forEach(btn => {
        btn.onclick = () => {
          const result = Game.doDiplomacy(factionId, btn.dataset.diploAction);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          if (result.ok) {
            // 刷新面板
            this._showDiplomacyPanel(factionId);
            this.renderTopbar();
            this.state._dirtyMap = true;
            // 刷新全屏地图中的势力卡片关系显示
            const factionsList = document.querySelector('.map-overlay-factions-list');
            if (factionsList) {
              factionsList.innerHTML = this._renderFactionCards();
              factionsList.querySelectorAll('.faction-clickable[data-faction]').forEach(card => {
                card.onclick = () => {
                  const fid = card.dataset.faction;
                  if (fid) this._showDiplomacyPanel(fid);
                };
              });
            }
            this.requestRender();
          }
        };
      });
    }
  },

  // ===== 时间轴 =====
  renderTimeline() {
    const s = Game.state;
    const f = s.flags;

    // 关键时间节点
    const milestones = [
      { year: 1962, label: '帝国登月', triggered: true },
      { year: 1963, label: '元首之死', triggered: s.turn > 4 || f.civil_war_imminent },
      { year: 1965, label: '内战结束', triggered: f.civil_war_over },
      { year: 1968, label: '俄军阀混战', triggered: f.russia_infiltrated || f.russia_proxies || s.year >= 1968 },
      { year: 1972, label: '俄罗斯统一', triggered: f.russia_unifier !== undefined || s.year >= 1972 },
      { year: 1975, label: '冷战高潮', triggered: s.year >= 1975 },
      { year: 1981, label: '西俄战争', triggered: f.west_russian_war },
      { year: 1989, label: '核危机', triggered: s.year >= 1989 },
      { year: 1996, label: '黄昏时代', triggered: s.year >= 1996 },
      { year: 2000, label: '终局', triggered: s.year >= 2000 }
    ];

    // 当前进度百分比
    const progressPct = Math.min(100, ((s.turn - 1) / s.totalTurns) * 100);

    const milestoneHtml = milestones.map(m => {
      const milestonePct = ((m.year - 1962) / 38) * 100;
      const isPast = s.year > m.year || (s.year === m.year && m.triggered);
      const isCurrent = s.year === m.year && !m.triggered;
      const cls = isPast ? 'past' : (isCurrent ? 'current' : 'future');
      return `
        <div class="timeline-milestone ${cls}" style="left:${milestonePct}%">
          <div class="tm-dot"></div>
          <div class="tm-label">${m.year}</div>
          <div class="tm-desc">${m.label}</div>
        </div>
      `;
    }).join('');

    return `
      <div class="timeline-container">
        <div class="timeline-bar">
          <div class="timeline-progress" style="width:${progressPct}%"></div>
          <div class="timeline-marker" style="left:${progressPct}%">
            <div class="tm-current">${s.year}Q${s.quarter}</div>
          </div>
          ${milestoneHtml}
        </div>
        <div class="timeline-labels">
          <span>1962</span>
          <span>1981</span>
          <span>2000</span>
        </div>
      </div>
    `;
  },

  // ===== 世界页 (全国家虚拟滚动列表) =====
  renderWorld() {
    if (!this._worldData) {
      this._worldData = this._buildWorldData();
    }
    const data = this._worldData;
    const total = data.length;

    return `
      <div class="world-container" style="padding:0;height:calc(100vh - 180px);display:flex;flex-direction:column;">
        <div class="world-toolbar" style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;gap:8px;align-items:center;flex-wrap:wrap;">
          <input id="world-search" type="text" placeholder="搜索国家名/缩写..." style="flex:1;min-width:180px;padding:8px 12px;background:var(--bg-secondary);border:1px solid var(--border);color:var(--text);border-radius:6px;font-size:13px;outline:none;" />
          <div id="world-filters" style="display:flex;gap:6px;flex-wrap:wrap;"></div>
          <span id="world-count" style="color:var(--text-muted);font-size:12px;margin-left:auto;"></span>
        </div>
        <div id="world-virtual-scroll" style="flex:1;overflow-y:auto;position:relative;">
          <div id="world-spacer" style="position:relative;"></div>
        </div>
        <!-- 国家详情全屏模态（带遮罩，z-index 9999） -->
        <div id="world-detail-mask" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:9998;backdrop-filter:blur(2px);"
             onclick="var el=document.getElementById('world-detail');el&&(el.style.display='none');this.style.display='none'"></div>
        <div id="world-detail" style="display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:min(520px,92vw);max-height:min(80vh,720px);background:var(--bg-secondary);border:1px solid var(--accent-steel);padding:18px;overflow-y:auto;z-index:9999;border-radius:10px;box-shadow:0 8px 40px rgba(0,0,0,0.6);"></div>
      </div>
    `;
  },

  _buildWorldData() {
    const major = [
      { id:'GER', name:'大日耳曼国', short:'德国', flag:'#a83232', sphere:'pakt', tier:'major', capital:'日耳曼尼亚', leader:'阿登纳' },
      { id:'USA', name:'美利坚合众国', short:'美国', flag:'#3a6a9a', sphere:'ofn', tier:'major', capital:'华盛顿', leader:'尼克松' },
      { id:'JAP', name:'大日本帝国', short:'日本', flag:'#d8d0a8', sphere:'japanese_sphere', tier:'major', capital:'东京', leader:'昭和天皇' },
      { id:'ITA', name:'意大利帝国', short:'意大利', flag:'#b0a060', sphere:'italian_sphere', tier:'major', capital:'罗马', leader:'墨索里尼' },
      { id:'BUR', name:'勃艮第骑士团国', short:'勃艮第', flag:'#3a1a3a', sphere:'pakt', tier:'major', capital:'南锡', leader:'希姆莱' },
      { id:'RUS', name:'俄罗斯诸军阀', short:'俄罗斯', flag:'#7a3a3a', sphere:'none', tier:'major', capital:'莫斯科', leader:'—' },
    ];
    const regional = [
      { id:'CAN', name:'加拿大', short:'加拿大', flag:'#d40000', sphere:'ofn', tier:'regional', capital:'渥太华', leader:'迪芬贝克' },
      { id:'MEX', name:'墨西哥合众国', short:'墨西哥', flag:'#006847', sphere:'none', tier:'regional', capital:'墨西哥城', leader:'鲁伊斯' },
      { id:'BRA', name:'巴西联邦共和国', short:'巴西', flag:'#009c3b', sphere:'none', tier:'regional', capital:'巴西利亚', leader:'库比契克' },
      { id:'ARG', name:'阿根廷共和国', short:'阿根廷', flag:'#74acdf', sphere:'none', tier:'regional', capital:'布宜诺斯艾利斯', leader:'弗朗迪西' },
      { id:'AUS', name:'澳大利亚联邦', short:'澳大利亚', flag:'#00008b', sphere:'ofn', tier:'regional', capital:'堪培拉', leader:'孟席斯' },
      { id:'IND', name:'印度共和国', short:'印度', flag:'#ff9933', sphere:'none', tier:'regional', capital:'新德里', leader:'尼赫鲁' },
      { id:'CHI', name:'中华民国', short:'中国', flag:'#fe0000', sphere:'japanese_sphere', tier:'regional', capital:'南京', leader:'蒋介石' },
      { id:'SAU', name:'沙特阿拉伯王国', short:'沙特', flag:'#006c35', sphere:'none', tier:'regional', capital:'利雅得', leader:'阿卜杜勒-阿齐兹' },
      { id:'IRN', name:'伊朗王国', short:'伊朗', flag:'#239f40', sphere:'pakt', tier:'regional', capital:'德黑兰', leader:'巴列维' },
      { id:'TUR', name:'土耳其共和国', short:'土耳其', flag:'#e30a17', sphere:'italian_sphere', tier:'regional', capital:'安卡拉', leader:'古尔特' },
      { id:'EGY', name:'埃及王国', short:'埃及', flag:'#ce1126', sphere:'italian_sphere', tier:'regional', capital:'开罗', leader:'纳赛尔' },
      { id:'ETH', name:'埃塞俄比亚帝国', short:'埃塞俄比亚', flag:'#ffcc00', sphere:'italian_sphere', tier:'regional', capital:'亚的斯亚贝巴', leader:'海尔·塞拉西' },
      { id:'THA', name:'暹罗王国', short:'泰国', flag:'#a51931', sphere:'japanese_sphere', tier:'regional', capital:'曼谷', leader:'普密蓬' },
      { id:'IDN', name:'印度尼西亚共和国', short:'印尼', flag:'#ff0000', sphere:'japanese_sphere', tier:'regional', capital:'雅加达', leader:'苏加诺' },
      { id:'VNM', name:'越南帝国', short:'越南', flag:'#ffcc00', sphere:'japanese_sphere', tier:'regional', capital:'顺化', leader:'保大' },
      { id:'KHM', name:'柬埔寨王国', short:'柬埔寨', flag:'#033ea0', sphere:'japanese_sphere', tier:'regional', capital:'金边', leader:'西哈努克' },
      { id:'MMR', name:'缅甸联邦', short:'缅甸', flag:'#fecb00', sphere:'japanese_sphere', tier:'regional', capital:'仰光', leader:'吴努' },
      { id:'MNG', name:'蒙古人民共和国', short:'蒙古', flag:'#c41230', sphere:'japanese_sphere', tier:'regional', capital:'乌兰巴托', leader:'泽登巴尔' },
      { id:'PAK', name:'巴基斯坦', short:'巴基斯坦', flag:'#01411c', sphere:'none', tier:'regional', capital:'伊斯兰堡', leader:'阿尤布·汗' },
      { id:'GBR', name:'联合王国', short:'英国', flag:'#012169', sphere:'pakt', tier:'regional', capital:'伦敦', leader:'伊丽莎白二世' },
      { id:'FRA', name:'法国', short:'法国', flag:'#002654', sphere:'pakt', tier:'regional', capital:'巴黎', leader:'贝当' },
      { id:'ESP', name:'西班牙国', short:'西班牙', flag:'#aa151b', sphere:'pakt', tier:'regional', capital:'马德里', leader:'佛朗哥' },
      { id:'PRT', name:'葡萄牙', short:'葡萄牙', flag:'#006600', sphere:'pakt', tier:'regional', capital:'里斯本', leader:'萨拉查' },
      { id:'POL', name:'波兰共和国', short:'波兰', flag:'#dc143c', sphere:'pakt', tier:'regional', capital:'华沙', leader:'—' },
      { id:'HUN', name:'匈牙利', short:'匈牙利', flag:'#477056', sphere:'pakt', tier:'regional', capital:'布达佩斯', leader:'—' },
      { id:'SWE', name:'瑞典王国', short:'瑞典', flag:'#006aa7', sphere:'none', tier:'regional', capital:'斯德哥尔摩', leader:'古斯塔夫六世' },
      { id:'FIN', name:'芬兰共和国', short:'芬兰', flag:'#003580', sphere:'pakt', tier:'regional', capital:'赫尔辛基', leader:'—' },
      { id:'CHL', name:'智利共和国', short:'智利', flag:'#0039a6', sphere:'none', tier:'regional', capital:'圣地亚哥', leader:'伊瓦涅斯' },
      { id:'COL', name:'哥伦比亚共和国', short:'哥伦比亚', flag:'#fcd116', sphere:'none', tier:'regional', capital:'波哥大', leader:'卡马戈' },
      { id:'CUB', name:'古巴共和国', short:'古巴', flag:'#002a8f', sphere:'none', tier:'regional', capital:'哈瓦那', leader:'—' },
      { id:'NLD', name:'尼德兰', short:'荷兰', flag:'#ae1c28', sphere:'pakt', tier:'regional', capital:'阿姆斯特丹', leader:'—' },
      { id:'BEL', name:'比利时', short:'比利时', flag:'#000000', sphere:'pakt', tier:'regional', capital:'布鲁塞尔', leader:'—' },
    ];
    const minor = [
      { id:'AFG', name:'阿富汗王国', short:'阿富汗', flag:'#006666', sphere:'none', tier:'minor', capital:'喀布尔', leader:'查希尔沙' },
      { id:'ALB', name:'阿尔巴尼亚王国', short:'阿尔巴尼亚', flag:'#c0392b', sphere:'italian_sphere', tier:'minor', capital:'地拉那', leader:'—' },
      { id:'AND', name:'安道尔公国', short:'安道尔', flag:'#00159b', sphere:'pakt', tier:'minor', capital:'安道尔城', leader:'—' },
      { id:'ARG_ANT', name:'阿根廷南极', short:'阿属南极', flag:'#74acdf', sphere:'none', tier:'minor', capital:'—', leader:'—' },
      { id:'AAB', name:'南极古腾堡基地', short:'古腾堡', flag:'#2a2a2a', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'AAJ', name:'日本南极', short:'日属南极', flag:'#d8d0a8', sphere:'japanese_sphere', tier:'minor', capital:'昭和基地', leader:'—' },
      { id:'AAO', name:'OFN南极', short:'美属南极', flag:'#3a6a9a', sphere:'ofn', tier:'minor', capital:'麦克默多', leader:'—' },
      { id:'AAB_ANT', name:'勃艮第南极', short:'勃属南极', flag:'#3a1a3a', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'AAF', name:'法属南半球', short:'法属南极', flag:'#002654', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'AAB_GER', name:'德国新斯瓦比亚', short:'新斯瓦比亚', flag:'#4a4a4a', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'AAG', name:'德国南极探险', short:'南极探险', flag:'#2a2a2a', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'AZE', name:'阿塞拜疆', short:'阿塞拜疆', flag:'#0098c3', sphere:'pakt', tier:'minor', capital:'巴库', leader:'—' },
      { id:'ARM', name:'亚美尼亚', short:'亚美尼亚', flag:'#d60000', sphere:'pakt', tier:'minor', capital:'埃里温', leader:'—' },
      { id:'AUT', name:'奥地利', short:'奥地利', flag:'#ed2939', sphere:'none', tier:'minor', capital:'维也纳', leader:'—' },
      { id:'AYR', name:'艾尔苏丹国', short:'艾尔', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'阿加德兹', leader:'易卜拉欣' },
      { id:'BAH', name:'巴哈马', short:'巴哈马', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'拿骚', leader:'—' },
      { id:'BEL_AFR', name:'比属刚果', short:'比属刚果', flag:'#000000', sphere:'pakt', tier:'minor', capital:'利奥波德维尔', leader:'—' },
      { id:'BEN', name:'达荷美共和国', short:'达荷美', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'波多诺伏', leader:'—' },
      { id:'BHT', name:'不丹王国', short:'不丹', flag:'#f47920', sphere:'japanese_sphere', tier:'minor', capital:'廷布', leader:'旺楚克' },
      { id:'BLR', name:'白俄罗斯', short:'白俄罗斯', flag:'#ce1720', sphere:'pakt', tier:'minor', capital:'明斯克', leader:'—' },
      { id:'BLZ', name:'英属洪都拉斯', short:'英属洪都拉斯', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'贝尔莫潘', leader:'—' },
      { id:'BOL', name:'玻利维亚共和国', short:'玻利维亚', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'拉巴斯', leader:'特拉萨斯' },
      { id:'BWA', name:'贝专纳', short:'贝专纳', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'哈博罗内', leader:'—' },
      { id:'BRB', name:'巴巴多斯', short:'巴巴多斯', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'布里奇敦', leader:'—' },
      { id:'BRY', name:'布里亚特', short:'布里亚特', flag:'#6a3a3a', sphere:'none', tier:'minor', capital:'乌兰乌德', leader:'—' },
      { id:'BUL', name:'保加利亚沙皇国', short:'保加利亚', flag:'#00966e', sphere:'pakt', tier:'minor', capital:'索非亚', leader:'—' },
      { id:'CAF', name:'中非共和国', short:'中非', flag:'#00209f', sphere:'pakt', tier:'minor', capital:'班加西', leader:'—' },
      { id:'CAN_AFR', name:'喀麦隆', short:'喀麦隆', flag:'#009a44', sphere:'pakt', tier:'minor', capital:'雅温得', leader:'—' },
      { id:'CHD', name:'乍得', short:'乍得', flag:'#00209f', sphere:'pakt', tier:'minor', capital:'恩贾梅纳', leader:'—' },
      { id:'CHT', name:'赤塔', short:'赤塔', flag:'#6a5a3a', sphere:'none', tier:'minor', capital:'赤塔', leader:'—' },
      { id:'CIV', name:'象牙海岸', short:'象牙海岸', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'阿比让', leader:'—' },
      { id:'CMR', name:'喀麦隆', short:'喀麦隆', flag:'#009a44', sphere:'pakt', tier:'minor', capital:'雅温得', leader:'—' },
      { id:'COD', name:'刚果民主共和国', short:'刚果金', flag:'#007bff', sphere:'pakt', tier:'minor', capital:'金沙萨', leader:'—' },
      { id:'COG', name:'刚果共和国', short:'刚果布', flag:'#009a44', sphere:'pakt', tier:'minor', capital:'布拉柴维尔', leader:'—' },
      { id:'CRI', name:'哥斯达黎加', short:'哥斯达黎加', flag:'#002a8f', sphere:'none', tier:'minor', capital:'圣何塞', leader:'—' },
      { id:'CRO', name:'克罗地亚王国', short:'克罗地亚', flag:'#003893', sphere:'pakt', tier:'minor', capital:'萨格勒布', leader:'—' },
      { id:'CUB_ANT', name:'智利南极', short:'智属南极', flag:'#0039a6', sphere:'none', tier:'minor', capital:'—', leader:'—' },
      { id:'CZE', name:'捷克斯洛伐克', short:'捷克斯洛伐克', flag:'#0060b5', sphere:'pakt', tier:'minor', capital:'布拉格', leader:'—' },
      { id:'DEU_ORG', name:'德意志骑士团国', short:'骑士团国', flag:'#4a2a4a', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'DJI', name:'法属阿法尔', short:'吉布提', flag:'#003da5', sphere:'italian_sphere', tier:'minor', capital:'吉布提市', leader:'—' },
      { id:'DNK', name:'丹麦王国', short:'丹麦', flag:'#c8102e', sphere:'pakt', tier:'minor', capital:'哥本哈根', leader:'弗雷德里克九世' },
      { id:'DOM', name:'多米尼加共和国', short:'多米尼加', flag:'#002a8f', sphere:'none', tier:'minor', capital:'圣多明各', leader:'—' },
      { id:'ECU', name:'厄瓜多尔共和国', short:'厄瓜多尔', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'基多', leader:'—' },
      { id:'ERI', name:'厄立特里亚', short:'厄立特里亚', flag:'#003da5', sphere:'italian_sphere', tier:'minor', capital:'阿斯马拉', leader:'—' },
      { id:'ESP_AFR', name:'西属撒哈拉', short:'西撒哈拉', flag:'#aa151b', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'EST', name:'爱沙尼亚', short:'爱沙尼亚', flag:'#72c2ce', sphere:'pakt', tier:'minor', capital:'塔林', leader:'—' },
      { id:'ETH_COL', name:'意属埃塞俄比亚', short:'意属埃塞俄比亚', flag:'#008c45', sphere:'italian_sphere', tier:'minor', capital:'亚的斯亚贝巴', leader:'—' },
      { id:'FAR', name:'法罗群岛', short:'法罗群岛', flag:'#006aa7', sphere:'ofn', tier:'minor', capital:'托尔斯港', leader:'—' },
      { id:'FAV', name:'自由飞行员', short:'自由飞行员', flag:'#4a5a3a', sphere:'none', tier:'minor', capital:'苏尔古特', leader:'—' },
      { id:'FJI', name:'斐济群岛', short:'斐济', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'苏瓦', leader:'—' },
      { id:'FIN', name:'芬兰共和国', short:'芬兰', flag:'#003580', sphere:'pakt', tier:'minor', capital:'赫尔辛基', leader:'—' },
      { id:'FRA_COL', name:'法属马达加斯加', short:'法属马达加斯加', flag:'#002654', sphere:'pakt', tier:'minor', capital:'塔那那利佛', leader:'—' },
      { id:'FSA', name:'自由沙特', short:'自由沙特', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'—', leader:'—' },
      { id:'GAB', name:'加蓬', short:'加蓬', flag:'#009a44', sphere:'pakt', tier:'minor', capital:'利伯维尔', leader:'—' },
      { id:'GBR_COL', name:'英属圭亚那', short:'英属圭亚那', flag:'#002a8f', sphere:'pakt', tier:'minor', capital:'乔治敦', leader:'—' },
      { id:'GBR_HON', name:'英属洪都拉斯', short:'英属洪都拉斯', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'—', leader:'—' },
      { id:'GER_NLD', name:'尼德兰专员辖区', short:'尼德兰专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'阿姆斯特丹', leader:'—' },
      { id:'GER_NOR', name:'挪威专员辖区', short:'挪威专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'奥斯陆', leader:'—' },
      { id:'GER_OST', name:'东方专员辖区', short:'东方专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'里加', leader:'—' },
      { id:'GER_UKR', name:'乌克兰专员辖区', short:'乌克兰专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'基辅', leader:'—' },
      { id:'GER_MOS', name:'莫斯科专员辖区', short:'莫斯科专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'莫斯科', leader:'—' },
      { id:'GER_KAU', name:'高加索专员辖区', short:'高加索专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'第比利斯', leader:'—' },
      { id:'GER_OSTAF', name:'东非专员辖区', short:'东非专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'布勒尔施塔特', leader:'—' },
      { id:'GER_SDAF', name:'西南非专员辖区', short:'西南非专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'温得和克', leader:'—' },
      { id:'GER_ZENTRAAF', name:'中非专员辖区', short:'中非专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'利奥波德维尔', leader:'—' },
      { id:'GER_RUSLAND', name:'俄罗斯专员辖区', short:'俄罗斯专员辖区', flag:'#aa2222', sphere:'pakt', tier:'minor', capital:'莫斯科', leader:'—' },
      { id:'GHA', name:'加纳共和国', short:'加纳', flag:'#ff0000', sphere:'none', tier:'minor', capital:'阿克拉', leader:'恩克鲁玛' },
      { id:'GIN', name:'几内亚共和国', short:'几内亚', flag:'#ff0000', sphere:'none', tier:'minor', capital:'科纳克里', leader:'塞古·杜尔' },
      { id:'GNB', name:'几内亚比绍', short:'几比', flag:'#00853f', sphere:'none', tier:'minor', capital:'比绍', leader:'—' },
      { id:'GOL', name:'黄金海岸', short:'黄金海岸', flag:'#ffcc00', sphere:'ofn', tier:'minor', capital:'阿克拉', leader:'—' },
      { id:'GRC', name:'希腊王国', short:'希腊', flag:'#0d5eaf', sphere:'italian_sphere', tier:'minor', capital:'雅典', leader:'保罗一世' },
      { id:'GUA', name:'危地马拉共和国', short:'危地马拉', flag:'#0060b5', sphere:'none', tier:'minor', capital:'危地马拉城', leader:'—' },
      { id:'GUC', name:'法属圭亚那', short:'法属圭亚那', flag:'#002654', sphere:'pakt', tier:'minor', capital:'卡宴', leader:'—' },
      { id:'GUY', name:'圭亚那合作共和国', short:'圭亚那', flag:'#009c3b', sphere:'none', tier:'minor', capital:'乔治敦', leader:'—' },
      { id:'HAI', name:'海地共和国', short:'海地', flag:'#00209f', sphere:'ofn', tier:'minor', capital:'太子港', leader:'—' },
      { id:'HND', name:'洪都拉斯共和国', short:'洪都拉斯', flag:'#0060b5', sphere:'none', tier:'minor', capital:'特古西加尔巴', leader:'—' },
      { id:'HUN', name:'匈牙利王国', short:'匈牙利', flag:'#ed2939', sphere:'pakt', tier:'minor', capital:'布达佩斯', leader:'—' },
      { id:'ICE', name:'冰岛共和国', short:'冰岛', flag:'#004080', sphere:'ofn', tier:'minor', capital:'雷克雅未克', leader:'—' },
      { id:'IND_COL', name:'英属印度', short:'英属印度', flag:'#ffcc00', sphere:'ofn', tier:'minor', capital:'新德里', leader:'—' },
      { id:'IND_FRA', name:'法属印度', short:'法属印度', flag:'#002654', sphere:'pakt', tier:'minor', capital:'本地治里', leader:'—' },
      { id:'IND_PRT', name:'葡属印度', short:'葡属印度', flag:'#006600', sphere:'pakt', tier:'minor', capital:'果阿', leader:'—' },
      { id:'IRE', name:'爱尔兰共和国', short:'爱尔兰', flag:'#169b62', sphere:'ofn', tier:'minor', capital:'都柏林', leader:'—' },
      { id:'ITA_COL', name:'意属非洲', short:'意属非洲', flag:'#008c45', sphere:'italian_sphere', tier:'minor', capital:'—', leader:'—' },
      { id:'JAM', name:'牙买加', short:'牙买加', flag:'#009a44', sphere:'ofn', tier:'minor', capital:'金斯顿', leader:'—' },
      { id:'JOR', name:'约旦哈希姆王国', short:'约旦', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'安曼', leader:'侯赛因' },
      { id:'KAS', name:'克什米尔', short:'克什米尔', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'—', leader:'—' },
      { id:'KAZ', name:'哈萨克苏维埃社会主义共和国', short:'哈萨克', flag:'#d8d0a8', sphere:'none', tier:'minor', capital:'阿拉木图', leader:'—' },
      { id:'KEN', name:'肯尼亚', short:'肯尼亚', flag:'#bb0000', sphere:'pakt', tier:'minor', capital:'内罗毕', leader:'—' },
      { id:'KHM', name:'高棉共和国', short:'高棉', flag:'#033ea0', sphere:'japanese_sphere', tier:'minor', capital:'金边', leader:'西哈努克' },
      { id:'KOR_ANT', name:'韩国', short:'韩国', flag:'#003478', sphere:'ofn', tier:'minor', capital:'首尔', leader:'李承晚' },
      { id:'KWT', name:'科威特王国', short:'科威特', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'科威特城', leader:'—' },
      { id:'LAO', name:'老挝王国', short:'老挝', flag:'#002d62', sphere:'japanese_sphere', tier:'minor', capital:'万象', leader:'西萨旺' },
      { id:'LBN', name:'黎巴嫩共和国', short:'黎巴嫩', flag:'#ed1c24', sphere:'italian_sphere', tier:'minor', capital:'贝鲁特', leader:'—' },
      { id:'LBR', name:'利比里亚共和国', short:'利比里亚', flag:'#c8102e', sphere:'ofn', tier:'minor', capital:'蒙罗维亚', leader:'—' },
      { id:'LBY', name:'利比亚王国', short:'利比亚', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'的黎波里', leader:'—' },
      { id:'LIE', name:'列支敦士登公国', short:'列支敦士登', flag:'#002b5c', sphere:'pakt', tier:'minor', capital:'瓦杜兹', leader:'弗朗茨·约瑟夫' },
      { id:'LTU', name:'立陶宛', short:'立陶宛', flag:'#f3b400', sphere:'pakt', tier:'minor', capital:'维尔纽斯', leader:'—' },
      { id:'LUX', name:'卢森堡', short:'卢森堡', flag:'#ed1c24', sphere:'pakt', tier:'minor', capital:'卢森堡城', leader:'—' },
      { id:'LV', name:'拉脱维亚', short:'拉脱维亚', flag:'#9e1b34', sphere:'pakt', tier:'minor', capital:'里加', leader:'—' },
      { id:'MAD', name:'马达加斯加', short:'马达加斯加', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'塔那那利佛', leader:'—' },
      { id:'MAG', name:'马加丹', short:'马加丹', flag:'#5a5a5a', sphere:'japanese_sphere', tier:'minor', capital:'马加丹', leader:'—' },
      { id:'MAR', name:'摩洛哥王国', short:'摩洛哥', flag:'#c1272d', sphere:'pakt', tier:'minor', capital:'拉巴特', leader:'穆罕默德五世' },
      { id:'MHL', name:'马绍尔群岛', short:'马绍尔', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'马朱罗', leader:'—' },
      { id:'MKD', name:'马其顿', short:'马其顿', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'斯科普里', leader:'—' },
      { id:'MLI', name:'马里共和国', short:'马里', flag:'#00853f', sphere:'none', tier:'minor', capital:'巴马科', leader:'莫迪博·凯塔' },
      { id:'MMR_ANT', name:'缅甸', short:'缅甸', flag:'#fecb00', sphere:'japanese_sphere', tier:'minor', capital:'仰光', leader:'吴努' },
      { id:'MNE', name:'黑山王国', short:'黑山', flag:'#c8102e', sphere:'italian_sphere', tier:'minor', capital:'采蒂涅', leader:'—' },
      { id:'MON', name:'摩纳哥公国', short:'摩纳哥', flag:'#b0a060', sphere:'pakt', tier:'minor', capital:'摩纳哥城', leader:'雷尼尔三世' },
      { id:'MOZ', name:'莫桑比克', short:'莫桑比克', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'马普托', leader:'—' },
      { id:'MRT', name:'毛里求斯', short:'毛里求斯', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'路易港', leader:'—' },
      { id:'MWI', name:'马拉维', short:'马拉维', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'利隆圭', leader:'—' },
      { id:'NAM', name:'西南非洲', short:'西南非洲', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'温得和克', leader:'—' },
      { id:'NCL', name:'新喀里多尼亚', short:'新喀里多尼亚', flag:'#002654', sphere:'pakt', tier:'minor', capital:'努美阿', leader:'—' },
      { id:'NER', name:'尼日尔共和国', short:'尼日尔', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'尼亚美', leader:'—' },
      { id:'NIC', name:'尼加拉瓜共和国', short:'尼加拉瓜', flag:'#002a8f', sphere:'none', tier:'minor', capital:'马那瓜', leader:'—' },
      { id:'NLD_ANT', name:'荷属安的列斯', short:'荷属安的列斯', flag:'#ae1c28', sphere:'ofn', tier:'minor', capital:'威廉斯塔德', leader:'—' },
      { id:'NRU', name:'瑙鲁共和国', short:'瑙鲁', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'亚伦', leader:'—' },
      { id:'NZL', name:'新西兰自治领', short:'新西兰', flag:'#00008b', sphere:'ofn', tier:'minor', capital:'惠灵顿', leader:'—' },
      { id:'OMA', name:'马斯喀特苏丹国', short:'马斯喀特', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'马斯喀特', leader:'赛义德·本·泰穆尔' },
      { id:'OMN', name:'阿曼', short:'阿曼', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'马斯喀特', leader:'—' },
      { id:'PAK_ANT', name:'巴基斯坦', short:'巴基斯坦', flag:'#01411c', sphere:'none', tier:'minor', capital:'伊斯兰堡', leader:'阿尤布·汗' },
      { id:'PAN', name:'巴拿马共和国', short:'巴拿马', flag:'#002a8f', sphere:'none', tier:'minor', capital:'巴拿马城', leader:'—' },
      { id:'PER', name:'秘鲁共和国', short:'秘鲁', flag:'#d91023', sphere:'none', tier:'minor', capital:'利马', leader:'普拉多' },
      { id:'PHI', name:'菲律宾共和国', short:'菲律宾', flag:'#0038a8', sphere:'japanese_sphere', tier:'minor', capital:'马尼拉', leader:'马科斯' },
      { id:'PNG', name:'巴布亚新几内亚', short:'巴新', flag:'#009a44', sphere:'ofn', tier:'minor', capital:'莫尔兹比港', leader:'—' },
      { id:'PRK', name:'朝鲜民主主义人民共和国', short:'朝鲜', flag:'#024fa2', sphere:'none', tier:'minor', capital:'平壤', leader:'—' },
      { id:'PRT_AFR', name:'葡属非洲', short:'葡属非洲', flag:'#006600', sphere:'pakt', tier:'minor', capital:'—', leader:'—' },
      { id:'PRY', name:'巴拉圭共和国', short:'巴拉圭', flag:'#009c3b', sphere:'none', tier:'minor', capital:'亚松森', leader:'莫里尼戈' },
      { id:'PSE', name:'耶路撒冷', short:'耶路撒冷', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'耶路撒冷', leader:'—' },
      { id:'QAT', name:'卡塔尔', short:'卡塔尔', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'多哈', leader:'—' },
      { id:'ROU', name:'罗马尼亚王国', short:'罗马尼亚', flag:'#002b7f', sphere:'pakt', tier:'minor', capital:'布加勒斯特', leader:'—' },
      { id:'RWA', name:'卢旺达', short:'卢旺达', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'基加利', leader:'—' },
      { id:'SAU_ANT', name:'沙特', short:'沙特', flag:'#006c35', sphere:'none', tier:'minor', capital:'利雅得', leader:'—' },
      { id:'SEN', name:'塞内加尔', short:'塞内加尔', flag:'#00853f', sphere:'none', tier:'minor', capital:'达喀尔', leader:'桑戈尔' },
      { id:'SLV', name:'萨尔瓦多共和国', short:'萨尔瓦多', flag:'#0060b5', sphere:'none', tier:'minor', capital:'圣萨尔瓦多', leader:'—' },
      { id:'SLB', name:'所罗门群岛', short:'所罗门群岛', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'霍尼亚拉', leader:'—' },
      { id:'SLE', name:'塞拉利昂', short:'塞拉利昂', flag:'#007ad9', sphere:'none', tier:'minor', capital:'弗里敦', leader:'—' },
      { id:'SLO', name:'斯洛伐克共和国', short:'斯洛伐克', flag:'#0b4ea2', sphere:'pakt', tier:'minor', capital:'布拉迪斯拉发', leader:'—' },
      { id:'SOM', name:'索马里', short:'索马里', flag:'#003da5', sphere:'italian_sphere', tier:'minor', capital:'摩加迪沙', leader:'—' },
      { id:'SRB', name:'塞尔维亚', short:'塞尔维亚', flag:'#c0392b', sphere:'pakt', tier:'minor', capital:'贝尔格莱德', leader:'—' },
      { id:'SSD', name:'南苏丹', short:'南苏丹', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'朱巴', leader:'—' },
      { id:'SGP', name:'新加坡自治邦', short:'新加坡', flag:'#ef3340', sphere:'japanese_sphere', tier:'minor', capital:'新加坡', leader:'李光耀' },
      { id:'SUI', name:'瑞士联邦', short:'瑞士', flag:'#d52b1e', sphere:'none', tier:'minor', capital:'伯尔尼', leader:'—' },
      { id:'SUR', name:'苏里南共和国', short:'苏里南', flag:'#007a45', sphere:'ofn', tier:'minor', capital:'帕拉马里博', leader:'—' },
      { id:'SWE_ANT', name:'瑞典', short:'瑞典', flag:'#006aa7', sphere:'none', tier:'minor', capital:'斯德哥尔摩', leader:'古斯塔夫六世' },
      { id:'SWZ', name:'斯威士兰', short:'斯威士兰', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'姆巴巴内', leader:'—' },
      { id:'SYR', name:'叙利亚共和国', short:'叙利亚', flag:'#ce1126', sphere:'none', tier:'minor', capital:'大马士革', leader:'—' },
      { id:'TCD', name:'乍得', short:'乍得', flag:'#00209f', sphere:'pakt', tier:'minor', capital:'恩贾梅纳', leader:'—' },
      { id:'TGO', name:'多哥', short:'多哥', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'洛美', leader:'—' },
      { id:'TTO', name:'特立尼达和多巴哥', short:'特多', flag:'#002a8f', sphere:'ofn', tier:'minor', capital:'西班牙港', leader:'—' },
      { id:'TUN', name:'突尼斯王国', short:'突尼斯', flag:'#e30a17', sphere:'italian_sphere', tier:'minor', capital:'突尼斯', leader:'—' },
      { id:'TWN', name:'中华民国台湾', short:'台湾', flag:'#fe0000', sphere:'ofn', tier:'minor', capital:'台北', leader:'蒋介石' },
      { id:'TZA', name:'坦噶尼喀', short:'坦噶尼喀', flag:'#008736', sphere:'pakt', tier:'minor', capital:'多多马', leader:'—' },
      { id:'UGA', name:'乌干达', short:'乌干达', flag:'#000000', sphere:'pakt', tier:'minor', capital:'坎帕拉', leader:'—' },
      { id:'UKR', name:'乌克兰', short:'乌克兰', flag:'#ffd500', sphere:'pakt', tier:'minor', capital:'基辅', leader:'—' },
      { id:'URG', name:'乌拉圭共和国', short:'乌拉圭', flag:'#ffcc00', sphere:'none', tier:'minor', capital:'蒙得维的亚', leader:'—' },
      { id:'USA_ANT', name:'美国', short:'美国', flag:'#3a6a9a', sphere:'ofn', tier:'minor', capital:'华盛顿', leader:'尼克松' },
      { id:'UZB', name:'乌兹别克苏维埃社会主义共和国', short:'乌兹别克', flag:'#d8d0a8', sphere:'none', tier:'minor', capital:'塔什干', leader:'—' },
      { id:'VAN', name:'瓦努阿图', short:'瓦努阿图', flag:'#009a44', sphere:'ofn', tier:'minor', capital:'维拉港', leader:'—' },
      { id:'VAT', name:'梵蒂冈城国', short:'梵蒂冈', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'梵蒂冈城', leader:'约翰二十三世' },
      { id:'VEN', name:'委内瑞拉共和国', short:'委内瑞拉', flag:'#fcd116', sphere:'none', tier:'minor', capital:'加拉加斯', leader:'拉里萨巴尔' },
      { id:'VUT', name:'瓦利斯和富图纳', short:'瓦富', flag:'#002654', sphere:'pakt', tier:'minor', capital:'马塔乌图', leader:'—' },
      { id:'YEM', name:'也门王国', short:'也门', flag:'#ffcc00', sphere:'italian_sphere', tier:'minor', capital:'萨那', leader:'穆塔瓦基勒' },
      { id:'YUG', name:'南斯拉夫王国', short:'南斯拉夫', flag:'#002b5c', sphere:'pakt', tier:'minor', capital:'贝尔格莱德', leader:'—' },
      { id:'ZAF', name:'南非联邦', short:'南非', flag:'#007749', sphere:'ofn', tier:'minor', capital:'比勒陀利亚', leader:'—' },
      { id:'ZMB', name:'北罗得西亚', short:'北罗得西亚', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'卢萨卡', leader:'—' },
      { id:'ZWE', name:'南罗得西亚', short:'南罗得西亚', flag:'#ffcc00', sphere:'pakt', tier:'minor', capital:'索尔兹伯里', leader:'—' },
    ];
    return [...major, ...regional, ...minor];
  },

  _bindWorld(initialFilter) {
    const UI = this;
    const container = document.getElementById('world-virtual-scroll');
    const spacer = document.getElementById('world-spacer');
    const searchInput = document.getElementById('world-search');
    const filtersEl = document.getElementById('world-filters');
    const countEl = document.getElementById('world-count');
    const ROW_H = 52;
    let filter = initialFilter || 'all';
    let search = '';
    let filteredList = [];

    const sphereNames = {
      pakt: '轴心', ofn: 'OFN', japanese_sphere: '共荣圈',
      italian_sphere: '三头同盟', none: '中立',
      syndicalist: '工团主义', turkish_sphere: '土耳其圈'
    };
    const tierNames = { major: '大国', regional: '地区', minor: '小国' };

    function applyFilter() {
      let list = UI._worldData;
      if (filter === 'major') list = list.filter(d => d.tier === 'major');
      else if (filter !== 'all' && filter !== 'major') list = list.filter(d => d.sphere === filter);
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(d => d.name.toLowerCase().includes(q) || d.short.toLowerCase().includes(q) || d.id.toLowerCase().includes(q));
      }
      filteredList = list;
      countEl.textContent = `显示 ${list.length} / ${UI._worldData.length}`;
    }

    function renderFilterChips() {
      const chips = [
        ['all', '全部'],
        ['major', '大国'],
        ['pakt', '轴心'],
        ['ofn', 'OFN'],
        ['japanese_sphere', '共荣圈'],
        ['italian_sphere', '三头同盟'],
        ['none', '中立'],
      ];
      filtersEl.innerHTML = chips.map(([k, l]) =>
        `<button data-filter="${k}" style="padding:4px 10px;font-size:11px;border:1px solid var(--border);border-radius:12px;background:${filter===k?'var(--accent)':'var(--bg-secondary)'};color:${filter===k?'#fff':'var(--text)'};cursor:pointer;transition:all .15s;">${l}</button>`
      ).join('');
      filtersEl.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => { filter = btn.dataset.filter; renderFilterChips(); applyFilter(); render(); };
      });
    }

    function render() {
      applyFilter();
      const total = filteredList.length;
      const viewH = container.clientHeight || 600;
      const buffer = 5;
      const startIdx = Math.max(0, Math.floor(container.scrollTop / ROW_H) - buffer);
      const endIdx = Math.min(total, Math.ceil((container.scrollTop + viewH) / ROW_H) + buffer);

      spacer.style.height = (total * ROW_H) + 'px';
      let html = '';
      for (let i = startIdx; i < endIdx; i++) {
        const d = filteredList[i];
        const bg = i % 2 ? 'rgba(255,255,255,0.02)' : 'transparent';
        html += `
          <div class="world-row" data-id="${d.id}" style="position:absolute;top:${i*ROW_H}px;left:0;right:0;height:${ROW_H}px;display:flex;align-items:center;padding:0 16px;border-bottom:1px solid var(--border);background:${bg};cursor:pointer;transition:background .15s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='${bg}'">
            <div style="width:28px;height:18px;background:${d.flag};border-radius:2px;margin-right:12px;flex-shrink:0;border:1px solid rgba(255,255,255,0.15);"></div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:13px;font-weight:500;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d.name}</div>
              <div style="font-size:11px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${d.short} · ${d.capital}${d.leader ? ' · ' + d.leader : ''}</div>
            </div>
            <div style="display:flex;gap:4px;flex-shrink:0;">
              <span style="font-size:10px;padding:2px 6px;border-radius:3px;background:var(--bg-secondary);color:var(--text-muted);">${sphereNames[d.sphere] || d.sphere}</span>
              <span style="font-size:10px;padding:2px 6px;border-radius:3px;background:var(--bg-secondary);color:var(--text-muted);">${tierNames[d.tier]}</span>
            </div>
          </div>
        `;
      }
      spacer.innerHTML = html;
      spacer.querySelectorAll('.world-row').forEach(row => {
        row.onclick = () => UI._showCountryDetail(row.dataset.id);
      });
    }

    container.onscroll = () => render();
    searchInput.oninput = (e) => { search = e.target.value; render(); };

    renderFilterChips();
    applyFilter();
    render();

    this._worldRaf = null;
    const ro = new ResizeObserver(() => { if (!this._worldRaf) this._worldRaf = requestAnimationFrame(() => { render(); this._worldRaf = null; }); });
    ro.observe(container);
    this._worldResizeObs = ro;
  },

  async _showCountryDetail(id) {
    const UI = this;
    const data = this._worldData.find(d => d.id === id);
    if (!data) return;
    const el = document.getElementById('world-detail');
    const mask = document.getElementById('world-detail-mask');
    function _close() {
      if (el) el.style.display = 'none';
      if (mask) mask.style.display = 'none';
    }
    if (el) el.style.display = 'block';
    if (mask) mask.style.display = 'block';
    el.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">加载中...</div>';

    let detail = null;
    if (typeof DataStore !== 'undefined') {
      detail = await DataStore.getCountry(id);
    }

    const fmt = (v) => {
      if (!v && v !== 0) return '—';
      if (typeof v === 'number') {
        if (v >= 1e8) return (v / 1e8).toFixed(2) + '亿';
        if (v >= 1e4) return (v / 1e4).toFixed(1) + '万';
        return v.toLocaleString();
      }
      return v;
    };

    if (detail) {
      const d = detail;
      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:32px;height:22px;background:${data.flag};border-radius:3px;border:1px solid rgba(255,255,255,0.2);"></div>
          <div style="flex:1;">
            <div style="font-size:16px;font-weight:600;color:var(--text);">${d.name || data.name}${data.short !== data.name ? ` <span style="font-size:13px;color:var(--text-muted);font-weight:400">(${data.short})</span>` : ''}</div>
            <div style="font-size:12px;color:var(--text-muted);">${data.capital}${data.leader ? ' · ' + data.leader : ''}</div>
          </div>
          <button onclick="var el=document.getElementById('world-detail');var mk=document.getElementById('world-detail-mask');if(el)el.style.display='none';if(mk)mk.style.display='none'" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px;">✕</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:16px;">
          ${d.gdp ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">GDP</div><div style="font-size:14px;color:var(--text);">${fmt(d.gdp)}</div></div>` : ''}
          ${d.population ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">人口</div><div style="font-size:14px;color:var(--text);">${fmt(d.population)}</div></div>` : ''}
          ${d.stability != null ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">稳定度</div><div style="font-size:14px;color:${d.stability>50?'var(--success)':'var(--danger)'}">${d.stability}</div></div>` : ''}
          ${d.support != null ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">支持率</div><div style="font-size:14px;color:var(--text);">${d.support}%</div></div>` : ''}
          ${d.army ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">陆军</div><div style="font-size:14px;color:var(--text);">${fmt(d.army)}k</div></div>` : ''}
          ${d.airforce ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">空军</div><div style="font-size:14px;color:var(--text);">${fmt(d.airforce)}</div></div>` : ''}
          ${d.navy ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">海军</div><div style="font-size:14px;color:var(--text);">${fmt(d.navy)}</div></div>` : ''}
          ${d.nuclear && d.nuclear.warheads ? `<div style="background:var(--bg-primary);padding:8px 12px;border-radius:6px;"><div style="font-size:10px;color:var(--text-muted);">核弹</div><div style="font-size:14px;color:var(--danger);">${d.nuclear.warheads}</div></div>` : ''}
        </div>
        ${d.desc ? `<div style="font-size:12px;color:var(--text-muted);line-height:1.6;margin-bottom:12px;">${d.desc}</div>` : ''}
        ${d.territories ? `<div style="font-size:11px;color:var(--text-muted);">领土: ${d.territories.join(', ')}</div>` : ''}
      `;
    } else {
      el.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
          <div style="width:32px;height:22px;background:${data.flag};border-radius:3px;border:1px solid rgba(255,255,255,0.2);"></div>
          <div style="flex:1;">
            <div style="font-size:16px;font-weight:600;color:var(--text);">${data.name}</div>
            <div style="font-size:12px;color:var(--text-muted);">${data.capital}${data.leader ? ' · ' + data.leader : ''}</div>
          </div>
          <button onclick="var el=document.getElementById('world-detail');var mk=document.getElementById('world-detail-mask');if(el)el.style.display='none';if(mk)mk.style.display='none'" style="background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:20px;">✕</button>
        </div>
        <div style="font-size:12px;color:var(--text-muted);text-align:center;padding:20px;">
          ${data.tier === 'minor' ? '此为小国/傀儡，详细数据暂未建模。' : '详细数据加载失败。'}
          <br>国家代码: ${id}
        </div>
      `;
    }
  },

  // ===== 国势页 (国家模拟系统) =====
  renderNation() {
    const s = Game.state;
    const NS = (typeof NationSim !== 'undefined') ? NationSim : null;
    if (!NS) return '<div style="padding:40px;text-align:center;color:var(--text-muted)">国家模拟系统未加载</div>';

    // 获取玩家国摘要
    const ger = NS.getSummary('GER');
    if (!ger) return '<div style="padding:40px;text-align:center;color:var(--text-muted)">数据加载中...</div>';

    // 获取势力排名
    const ranking = NS.getPowerRanking();
    const gerRank = ranking.findIndex(r => r.id === 'GER') + 1;

    // 格式化数字
    const fmtGDP = (v) => {
      if (v >= 1000000) return (v / 1000000).toFixed(2) + '万亿';
      if (v >= 10000) return (v / 10000).toFixed(1) + '亿';
      return v.toLocaleString() + '万';
    };
    const fmtPop = (v) => {
      if (v >= 100000000) return (v / 100000000).toFixed(2) + '亿';
      if (v >= 10000) return (v / 10000).toFixed(0) + '万';
      return v.toLocaleString();
    };
    const fmtPct = (v) => (v * 100).toFixed(1) + '%';

    // 进度条颜色
    const barColor = (pct, thresholds = [30, 60]) => {
      if (pct < thresholds[0]) return '#c84040';
      if (pct < thresholds[1]) return '#c8a040';
      return '#4a8a4a';
    };

    // GDP趋势图 (简易柱状图)
    const gdpHistory = ger.gdpHistory || [ger.gdp];
    const maxGdp = Math.max.apply(null, gdpHistory);
    const minGdp = Math.min.apply(null, gdpHistory);
    const gdpRange = Math.max(1, maxGdp - minGdp);
    const chartBars = gdpHistory.slice(-40).map((v, i) => {
      const h = Math.max(2, ((v - minGdp) / gdpRange) * 48 + 4);
      const isLast = i === gdpHistory.slice(-40).length - 1;
      return `<div style="display:inline-block;width:${100/Math.min(40, gdpHistory.length)}%;height:${h}px;background:${isLast ? '#e8c860' : 'rgba(232,200,96,0.4)'};border-radius:1px 1px 0 0;vertical-align:bottom;" title="${fmtGDP(v)}"></div>`;
    }).join('');

    // 势力对比条 (含AI国家战略)
    const maxPower = ranking[0] ? ranking[0].power : 100;
    const rankingHtml = ranking.map((r, i) => {
      const isPlayer = r.id === 'GER';
      const pct = (r.power / maxPower) * 100;
      const colors = { GER:'#a83232', USA:'#3a6a9a', JAP:'#b89438', ITA:'#5a8a4a', BUR:'#4a2a4a', RUS:'#7a3a3a' };
      const c = colors[r.id] || '#5a5a5a';
      // 获取该国AI战略
      const aiSum = NS.getSummary(r.id);
      const ai = aiSum && aiSum.aiState;
      const diploSign = ai ? (ai.diploMod > 0 ? '+' : '') + ai.diploMod.toFixed(0) : '';
      const diploColor = ai ? (ai.diploMod > 5 ? '#4a8a4a' : (ai.diploMod < -5 ? '#c84040' : 'var(--text-muted)')) : 'var(--text-muted)';
      const milTag = ai ? (ai.milMod > 0.2 ? '·扩军' : (ai.milMod < -0.1 ? '·裁军' : '')) : '';
      return `
        <div style="margin-bottom:8px;${isPlayer ? 'background:rgba(168,50,50,0.08);border-radius:4px;padding:4px 6px;' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
            <span style="font-size:12px;color:${isPlayer ? 'var(--accent-gold-bright)' : 'var(--text-primary)'};font-weight:${isPlayer ? 'bold' : 'normal'}">${i+1}. ${r.name}</span>
            <span style="font-size:11px;color:var(--text-muted)">国力 ${r.power}</span>
          </div>
          <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:linear-gradient(90deg,${c},${c}cc);border-radius:3px;"></div>
          </div>
          <div style="display:flex;gap:8px;margin-top:2px;font-size:10px;color:var(--text-muted);align-items:center;flex-wrap:wrap;">
            <span>GDP ${fmtGDP(r.gdp)}</span>
            <span>核弹 ${r.nukes}</span>
            <span>威慑 ${r.deterrence}</span>
            ${ai ? `<span style="margin-left:auto;padding:1px 6px;background:rgba(255,255,255,0.05);border:1px solid var(--border);border-radius:8px;font-size:9px;color:var(--accent-gold);">战略: ${ai.goalName}${milTag}</span><span style="font-size:9px;color:${diploColor};">对德${diploSign}</span>` : '<span style="margin-left:auto;font-size:9px;color:var(--accent-gold-bright);">玩家</span>'}
          </div>
        </div>`;
    }).join('');

    // 预算分配条
    const b = ger.budget || {};
    const budgetItems = [
      { label: '军事', val: b.military || 0, color: '#c84040' },
      { label: '福利', val: b.welfare || 0, color: '#4a8a4a' },
      { label: '研发', val: b.research || 0, color: '#4a7aaa' },
      { label: '行政', val: b.administration || 0, color: '#8a7a4a' },
      { label: '情报', val: b.espionage || 0, color: '#4a2a4a' }
    ];
    const budgetBar = budgetItems.map(bi =>
      `<div style="display:inline-block;height:18px;width:${(bi.val*100).toFixed(1)}%;background:${bi.color};line-height:18px;text-align:center;font-size:9px;color:#fff;overflow:hidden;white-space:nowrap;">${bi.val>0.05?bi.label:''}</div>`
    ).join('');

    // 科技等级
    const techStars = (tier) => '★'.repeat(tier) + '☆'.repeat(Math.max(0, 5 - tier));

    return `
      <div class="nation-page" style="padding:16px;">
        <!-- 国家概况 -->
        <div style="background:linear-gradient(135deg,rgba(168,50,50,0.12),rgba(60,30,30,0.05));border:1px solid var(--border);border-radius:6px;padding:14px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:8px;">
            <div>
              <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);letter-spacing:0.08em;margin:0 0 4px;">${ger.name}</h2>
              <div style="font-size:12px;color:var(--text-muted);">
                元首: ${ger.leader} · 首都: ${ger.capital} · 意识形态: ${ger.ideology}
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:11px;color:var(--text-muted);">综合国力排名</div>
              <div style="font-size:24px;font-weight:bold;color:${gerRank === 1 ? 'var(--accent-gold-bright)' : 'var(--text-primary)'};">第${gerRank}位</div>
              <div style="font-size:10px;color:var(--text-muted);">/${ranking.length}国</div>
            </div>
          </div>
        </div>

        <!-- 经济面板 -->
        <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:10px;">
          <h3 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:14px;margin:0 0 10px;letter-spacing:0.08em;">经济</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:10px;">
            <div style="text-align:center;padding:6px;background:rgba(255,255,255,0.03);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">GDP</div>
              <div style="font-size:15px;font-weight:bold;color:#e8c860;">${fmtGDP(ger.gdp)}</div>
              <div style="font-size:9px;color:${ger.gdpGrowth > 0 ? '#4a8a4a' : '#c84040'};">${ger.gdpGrowth > 0 ? '↑' : '↓'} ${(ger.gdpGrowth*100).toFixed(2)}%/年</div>
            </div>
            <div style="text-align:center;padding:6px;background:rgba(255,255,255,0.03);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">国库</div>
              <div style="font-size:15px;font-weight:bold;color:#c8c8a0;">${fmtGDP(ger.treasury)}</div>
              <div style="font-size:9px;color:var(--text-muted);">税率 ${fmtPct(ger.taxRate)}</div>
            </div>
            <div style="text-align:center;padding:6px;background:rgba(255,255,255,0.03);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">通胀率</div>
              <div style="font-size:15px;font-weight:bold;color:${ger.inflation > 0.08 ? '#c84040' : '#a0a0a0'};">${fmtPct(ger.inflation)}</div>
              <div style="font-size:9px;color:var(--text-muted);">${ger.inflation > 0.08 ? '⚠ 恶性通胀' : ger.inflation > 0.05 ? '偏高' : '正常'}</div>
            </div>
            <div style="text-align:center;padding:6px;background:rgba(255,255,255,0.03);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">人均GDP</div>
              <div style="font-size:15px;font-weight:bold;color:#a0c8e0;">${(ger.gdpPerCapita/1000).toFixed(1)}千</div>
              <div style="font-size:9px;color:var(--text-muted);">马克</div>
            </div>
          </div>
          <!-- GDP趋势图 -->
          <div style="margin-top:8px;">
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">GDP趋势 (近${Math.min(40, gdpHistory.length)}季度)</div>
            <div style="height:56px;display:flex;align-items:flex-end;border-bottom:1px solid var(--border);border-left:1px solid var(--border);padding:2px;">
              ${chartBars || '<div style="font-size:11px;color:var(--text-muted);margin:auto;">数据收集中</div>'}
            </div>
          </div>
          <!-- 预算分配 -->
          <div style="margin-top:10px;">
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:4px;">政府预算分配</div>
            <div style="height:18px;border-radius:3px;overflow:hidden;display:flex;background:rgba(255,255,255,0.05);">
              ${budgetBar}
            </div>
          </div>
        </div>

        <!-- 政治面板 -->
        <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:10px;">
          <h3 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:14px;margin:0 0 10px;letter-spacing:0.08em;">政治</h3>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
            <div>
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">
                <span style="color:var(--text-muted);">稳定度</span>
                <span style="color:${barColor(ger.stability)};font-weight:bold;">${ger.stability.toFixed(1)}</span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${ger.stability}%;background:${barColor(ger.stability)};border-radius:3px;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">
                <span style="color:var(--text-muted);">支持率</span>
                <span style="color:${barColor(ger.support)};font-weight:bold;">${ger.support.toFixed(1)}</span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${ger.support}%;background:${barColor(ger.support)};border-radius:3px;"></div>
              </div>
            </div>
            <div>
              <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;">
                <span style="color:var(--text-muted);">腐败度</span>
                <span style="color:${ger.corruption > 0.2 ? '#c84040' : '#a0a0a0'};font-weight:bold;">${fmtPct(ger.corruption)}</span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
                <div style="height:100%;width:${ger.corruption * 100 * 2}%;background:${ger.corruption > 0.2 ? '#c84040' : '#8a7a4a'};border-radius:3px;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 军事面板 -->
        <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:10px;">
          <h3 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:14px;margin:0 0 10px;letter-spacing:0.08em;">军事</h3>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">
            <div style="text-align:center;padding:8px 4px;background:rgba(168,50,50,0.08);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">陆军</div>
              <div style="font-size:16px;font-weight:bold;color:#e8a0a0;">${ger.army}</div>
            </div>
            <div style="text-align:center;padding:8px 4px;background:rgba(168,50,50,0.08);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">空军</div>
              <div style="font-size:16px;font-weight:bold;color:#a0c8e0;">${ger.airforce}</div>
            </div>
            <div style="text-align:center;padding:8px 4px;background:rgba(168,50,50,0.08);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">海军</div>
              <div style="font-size:16px;font-weight:bold;color:#a0a0d0;">${ger.navy}</div>
            </div>
            <div style="text-align:center;padding:8px 4px;background:rgba(168,50,50,0.12);border-radius:4px;">
              <div style="font-size:10px;color:var(--text-muted);">核弹头</div>
              <div style="font-size:16px;font-weight:bold;color:#e8c860;">${ger.nukes}</div>
            </div>
          </div>
          <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-size:11px;color:var(--text-muted);">核威慑值</span>
            <div style="flex:1;margin:0 8px;height:6px;background:rgba(255,255,255,0.06);border-radius:3px;overflow:hidden;">
              <div style="height:100%;width:${Math.min(100, ger.nukeDeterrence/150*100)}%;background:linear-gradient(90deg,#4a4a8a,#e8c860);border-radius:3px;"></div>
            </div>
            <span style="font-size:12px;font-weight:bold;color:${ger.nukeDeterrence > 50 ? '#e8c860' : '#a0a0a0'};">${ger.nukeDeterrence}/150</span>
          </div>
          <!-- 核威慑公式分解 -->
          ${(() => {
            const db = ger.deterBreakdown;
            if (!db) return '';
            return `
              <div style="margin-top:8px;padding-top:6px;border-top:1px dashed var(--border);font-size:9px;color:var(--text-muted);line-height:1.5;">
                <div style="color:var(--accent-gold);font-size:10px;margin-bottom:2px;">威慑构成</div>
                <div>核弹×5: <span style="color:#e8c860;">${db.warheads}</span> · 投送: <span style="color:#a0c8e0;">${db.delivery}</span></div>
                <div>科技: <span style="color:#a0d0a0;">${db.tech}</span> · 外交: <span style="color:${db.diplo > 0 ? '#4a8a4a' : '#c84040'};">${db.diplo > 0 ? '+' : ''}${db.diplo}</span> · 工效: <span style="color:#a0a0d0;">${db.eff}</span></div>
              </div>`;
          })()}
        </div>

        <!-- 核危机状态警示 -->
        ${(() => {
          const crisis = NS.getNuclearCrisis ? NS.getNuclearCrisis() : null;
          if (!crisis) return '';
          const effText = crisis.level === 'low' ? '无影响' :
            (crisis.level === 'medium' ? `稳定-${Math.abs(crisis.effects.stability)}/回合 · GDP-${Math.abs(crisis.effects.gdpMod*100).toFixed(1)}%/回合` :
            `稳定-${Math.abs(crisis.effects.stability)}/回合 · GDP-${Math.abs(crisis.effects.gdpMod*100).toFixed(1)}%/回合`);
          return `
            <div style="background:${crisis.color}15;border:1px solid ${crisis.color}50;border-radius:6px;padding:10px;margin-bottom:10px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div>
                  <span style="font-family:var(--font-serif);color:${crisis.color};font-size:13px;font-weight:bold;">⚠ 核危机: ${crisis.name}</span>
                  <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">全球平均威慑 ${crisis.avgDeter} · ${effText}</div>
                </div>
                <div style="text-align:right;font-size:9px;color:var(--text-muted);line-height:1.4;">
                  ${Object.keys(crisis.breakdown).map(id => `<div>${id}: ${crisis.breakdown[id]}</div>`).join('')}
                </div>
              </div>
            </div>`;
        })()}

        <!-- 科技 + 工业 + 人口 -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">
          <!-- 科技 -->
          <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:10px;">
            <h4 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:12px;margin:0 0 8px;">科技等级</h4>
            <div style="font-size:11px;line-height:1.8;">
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">军事科技</span><span style="color:#e8a0a0;">${techStars(ger.techMil)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">民用科技</span><span style="color:#a0c8e0;">${techStars(ger.techCiv)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">核技术</span><span style="color:#e8c860;">${techStars(ger.techNuke)}</span></div>
              <div style="display:flex;justify-content:space-between;"><span style="color:var(--text-muted);">火箭技术</span><span style="color:#a0d0a0;">${techStars(ger.techRocket)}</span></div>
            </div>
          </div>
          <!-- 工业系统 (四类工业 + 效率公式) -->
          <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:10px;">
            <h4 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:12px;margin:0 0 8px;">工业体系</h4>
            <div style="font-size:10px;color:var(--text-muted);margin-bottom:6px;border-bottom:1px dashed var(--border);padding-bottom:4px;">
              效率 = 数量/槽位 × 科技 × 稳定 · 综合: <span style="font-weight:bold;color:${ger.industryEff > 0.7 ? '#4a8a4a' : '#c8a040'};">${fmtPct(ger.industryEff)}</span>
            </div>
            <div style="font-size:10px;line-height:1.6;">
              ${(() => {
                const is = ger.industryStats;
                if (!is) return '<div style="color:var(--text-muted);">建筑工业统计中...</div>';
                const rows = [
                  { key:'civil',    name:'民用', color:'#a0c8e0', icon:'🏭', desc:'GDP+稳定' },
                  { key:'military', name:'军事', color:'#e8a0a0', icon:'⚔️', desc:'军力+威慑' },
                  { key:'hitech',   name:'高科技', color:'#c8a0e0', icon:'🔬', desc:'研发+科技' },
                  { key:'energy',   name:'能源', color:'#e0c060', icon:'⚡', desc:'石油+效率' }
                ];
                return rows.map(row => {
                  const cnt = is.counts[row.key];
                  const slot = is.slots[row.key];
                  const e = is.eff[row.key];
                  const fillPct = slot > 0 ? Math.min(100, (cnt / slot) * 100) : 0;
                  const effPct = (e * 100).toFixed(0);
                  return `
                    <div style="margin-bottom:5px;">
                      <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:${row.color};">${row.icon} ${row.name}</span>
                        <span style="color:var(--text-muted);font-size:9px;">${cnt}/${slot} · ${row.desc}</span>
                      </div>
                      <div style="display:flex;align-items:center;gap:4px;margin-top:2px;">
                        <div style="flex:1;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;">
                          <div style="width:${fillPct}%;height:100%;background:${row.color};opacity:0.7;"></div>
                        </div>
                        <span style="font-size:9px;color:${e > 0.3 ? '#4a8a4a' : 'var(--text-muted)'};min-width:28px;text-align:right;">${effPct}%</span>
                      </div>
                    </div>`;
                }).join('');
              })()}
            </div>
          </div>
        </div>

        <!-- 人口 -->
        <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:10px;margin-bottom:12px;">
          <h4 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:12px;margin:0 0 8px;">人口与社会</h4>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;font-size:11px;text-align:center;">
            <div><div style="color:var(--text-muted);font-size:9px;">总人口</div><div style="font-weight:bold;">${fmtPop(ger.population)}</div></div>
            <div><div style="color:var(--text-muted);font-size:9px;">预期寿命</div><div style="font-weight:bold;">${ger.lifeExpectancy}岁</div></div>
            <div><div style="color:var(--text-muted);font-size:9px;">识字率</div><div style="font-weight:bold;">${fmtPct(ger.literacy)}</div></div>
            <div><div style="color:var(--text-muted);font-size:9px;">城镇化</div><div style="font-weight:bold;">${fmtPct(ger.urbanRate)}</div></div>
          </div>
        </div>

        <!-- 势力对比 -->
        <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:12px;">
          <h3 style="font-family:var(--font-serif);color:var(--accent-gold);font-size:14px;margin:0 0 10px;letter-spacing:0.08em;">列强国力对比</h3>
          ${rankingHtml}
        </div>

        <div style="text-align:center;margin-top:12px;font-size:10px;color:var(--text-muted);">
          数据来源: NationSim v1.0 · ${NS._fallback ? '内置数据' : 'JSON加载'} · ${Game.getDateStr()}
        </div>
      </div>
    `;
  },

  // ===== 概览页 =====
  renderOverview() {
    const s = Game.state;
    const r = s.resources;
    const income = Game.calculateIncome();

    const recentEvents = s.eventLog.slice(0, 8).map(e =>
      `<div class="log-entry"><span class="log-date">${e.date}</span>${e.title} — <em style="color:var(--accent-gold)">${e.choice}</em></div>`
    ).join('') || '<div style="color:var(--text-muted);font-size:12px">尚无重大事件</div>';

    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>帝国状态</h4>
          <div class="big-num">${Math.round(r.stability)}</div>
          <div class="desc">稳定度 / 100</div>
        </div>
        <div class="overview-card">
          <h4>军事威慑</h4>
          <div class="big-num">${Math.round(r.deterrence)}</div>
          <div class="desc">综合威慑 / 150</div>
        </div>
        <div class="overview-card">
          <h4>核武库</h4>
          <div class="big-num">${Math.round(r.nukes)}</div>
          <div class="desc">核武器数量</div>
        </div>
        <div class="overview-card">
          <h4>财政</h4>
          <div class="big-num">${Math.round(r.money)}</div>
          <div class="desc">帝国马克 (百万元) | 每季 ${income.money > 0 ? '+' : ''}${Math.round(income.money)}</div>
        </div>
      </div>
      <div class="situation-log">
        <h4>近期要事</h4>
        ${recentEvents}
      </div>
      <div style="margin-top:16px;padding:14px;background:var(--bg-panel);border:1px solid var(--border);border-left:3px solid var(--accent-steel);border-radius:2px;">
        <h4 style="font-family:var(--font-serif);color:var(--accent-gold);margin-bottom:8px;letter-spacing:0.1em">帝国纪要</h4>
        <div style="font-size:13px;color:var(--text-secondary);line-height:1.8;font-family:var(--font-serif)">
          ${this.getSituationSummary()}
        </div>
      </div>
      <div style="margin-top:16px;">
        <h4 style="font-family:var(--font-serif);color:var(--accent-gold);margin-bottom:10px;letter-spacing:0.1em">历史进程</h4>
        ${this.renderTimeline()}
      </div>
    `;
  },

  getSituationSummary() {
    const s = Game.state;
    const r = s.resources;
    let parts = [];

    if (s.year < 1963 && !s.flags.civil_war_imminent) {
      parts.push(`<strong>1962年。</strong>帝国刚刚登月，但元首遇刺，权力真空已然形成。四位继承者虎视眈眈，街头的年轻人开始反抗。`);
    } else if (s.flags.civil_war_imminent && !s.flags.civil_war_over) {
      parts.push(`<strong>内战爆发。</strong>帝国分崩离析，四派势力争夺那张椅子。你的选择将决定一切。`);
    } else if (s.flags.civil_war_over && s.year < 1972) {
      parts.push(`<strong>内战结束，重建开始。</strong>帝国满目疮痍，但新元首已就位。前路漫长。`);
    } else if (s.year >= 1972 && s.year < 1985) {
      parts.push(`<strong>冷战高潮。</strong>三极世界的核武器足以毁灭文明十次。勃艮第的阴影、俄罗斯的重生、美国的动荡——每一处都是火药桶。`);
    } else if (s.year >= 1985 && s.year < 1996) {
      parts.push(`<strong>黄昏时代。</strong>帝国的黄金已逝，新的挑战接踵而至：计算机、环境、人口、解殖。旧秩序在松动。`);
    } else if (s.year >= 1996) {
      parts.push(`<strong>最后倒计时。</strong>2000年临近，千年帝国的终章即将书写。你的每一个选择，都将在历史中回响。`);
    }

    if (r.stability < 25) parts.push(`<em style="color:var(--accent-blood-bright)">⚠ 帝国稳定度危急，崩溃风险极高。</em>`);
    if (r.deterrence < 20) parts.push(`<em style="color:var(--accent-blood-bright)">⚠ 威慑力不足，敌国蠢蠢欲动。</em>`);
    if (r.money < 0) parts.push(`<em style="color:var(--accent-blood-bright)">⚠ 国库赤字，经济危机迫近。</em>`);
    if (s.flags.burgundian_threat && !s.flags.burgundian_war) parts.push(`<em style="color:var(--accent-gold)">⌬ 勃艮第的核威胁未除。</em>`);

    return parts.join('<br><br>');
  },

  // ===== 工业页 =====
  renderIndustry() {
    const s = Game.state;
    const queueHtml = s.buildQueue.length > 0
      ? `<div style="margin-bottom:16px;padding:12px;background:var(--bg-panel);border:1px solid var(--border);border-radius:2px;">
          <div style="font-family:var(--font-serif);color:var(--accent-gold);margin-bottom:8px;letter-spacing:0.1em">建造队列</div>
          ${s.buildQueue.map(q => `<div style="font-size:12px;color:var(--text-secondary);padding:3px 0">${q.name} — 剩余 ${q.turnsLeft} 季度</div>`).join('')}
        </div>`
      : '';

    const buildings = Object.values(BUILDINGS);
    const civilian = buildings.filter(b => b.type === 'civilian');
    const military = buildings.filter(b => b.type === 'military');

    const renderCard = (b) => {
      const count = s.buildings[b.id] || 0;
      const canBuild = s.resources.money >= b.cost && (!b.requires || s.flags[b.requires] || s.techs[b.requires]);
      const requiresMsg = b.requires && (!s.flags[b.requires] && !s.techs[b.requires])
        ? ` <span style="color:var(--accent-blood-bright);font-size:10px">(需${TECHS[b.requires]?.name || b.requires})</span>` : '';

      const effectHtml = Object.entries(b.effects).map(([k, v]) => {
        const sign = v > 0 ? '+' : '';
        const cls = v > 0 ? 'gain' : 'cost';
        const labels = {
          money: '资金', manpower: '人力', stability: '稳定', deterrence: '威慑',
          militaryPower: '军力', nukeDeter: '核慑', nukes: '核弹', research: '研发', efficiency: '效率'
        };
        return `<span class="b-stat ${cls}">${labels[k] || k} ${sign}${v}</span>`;
      }).join('');
      const maintHtml = b.maint > 0 ? `<span class="b-stat cost">维护 -${b.maint}资金</span>` : '';

      return `
        <div class="building-card ${b.type}">
          <div class="b-name">${b.name} ${requiresMsg}</div>
          <div class="b-desc">${b.desc}</div>
          <div class="b-count">已建: ${count} 座</div>
          <div class="b-stats">
            <span class="b-stat cost">造价 ${b.cost} 资金</span>
            <span class="b-stat">${b.buildTime}季</span>
            ${effectHtml}
            ${maintHtml}
          </div>
          <div class="b-actions">
            <button class="btn btn-build" data-build="${b.id}" ${canBuild ? '' : 'disabled'}>建造</button>
            ${count > 0 ? `<button class="btn btn-demolish" data-demolish="${b.id}">拆除</button>` : ''}
          </div>
        </div>`;
    };

    const html = `
      <div class="industry-header">
        <h2>帝国工业</h2>
        <div style="font-size:12px;color:var(--text-secondary)">资金: <span style="color:var(--accent-gold);font-family:var(--font-mono)">${Math.round(s.resources.money)} 资金</span></div>
      </div>
      ${queueHtml}
      <h3 style="font-family:var(--font-serif);color:var(--accent-steel);margin-bottom:10px;letter-spacing:0.1em;border-bottom:1px solid var(--border);padding-bottom:6px">民工业 — 经济与发展</h3>
      <div class="building-grid">
        ${civilian.map(renderCard).join('')}
      </div>
      <h3 style="font-family:var(--font-serif);color:var(--accent-blood);margin:20px 0 10px;letter-spacing:0.1em;border-bottom:1px solid var(--border);padding-bottom:6px">军工业 — 威慑与战争</h3>
      <div class="building-grid">
        ${military.map(renderCard).join('')}
      </div>
    `;

    // 绑定按钮（延迟，因为innerHTML刚设置）
    setTimeout(() => {
      document.querySelectorAll('[data-build]').forEach(btn => {
        btn.onclick = () => {
          const result = Game.buildBuilding(btn.dataset.build);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.requestRender();
        };
      });
      document.querySelectorAll('[data-demolish]').forEach(btn => {
        btn.onclick = () => {
          const result = Game.demolishBuilding(btn.dataset.demolish);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.requestRender();
        };
      });
    }, 0);

    return html;
  },

  // ===== 国策树页（沿用 policy 标签） =====
  renderPolicy() {
    const s = Game.state;
    const branches = { '经济': [], '军事': [], '政治': [], '外交': [], '科技': [] };
    for (const f of Object.values(NATIONAL_FOCI)) {
      if (branches[f.branch]) branches[f.branch].push(f);
    }

    // 当前国策进度
    let currentFocusHtml = '';
    if (s.currentFocus) {
      const f = NATIONAL_FOCI[s.currentFocus];
      const pct = (s.focusProgress / f.turns) * 100;
      currentFocusHtml = `
        <div class="focus-current">
          <div class="fc-name">${f.name}</div>
          <div class="fc-progress-bar">
            <div class="fc-progress-fill" style="width:${pct}%"></div>
          </div>
          <div class="fc-turns">${s.focusProgress}/${f.turns} 回合</div>
        </div>`;
    }

    // 渲染每个分支
    const renderBranch = (branchName, foci) => {
      const cards = foci.map(f => {
        const completed = s.completedFoci.includes(f.id);
        const current = s.currentFocus === f.id;
        const canStart = Game.canStartFocus(f.id);
        const lockReason = !canStart && !completed && !current ? Game.getFocusLockReason(f.id) : '';
        const cls = completed ? 'completed' : current ? 'current' : canStart ? 'available' : 'locked';
        const labels = {money:'资金',manpower:'人力',stability:'稳定',deterrence:'威慑',militaryPower:'军力',nukeDeter:'核慑',research:'研发',nukes:'核弹'};
        return `
          <div class="focus-card ${cls}" data-focus="${f.id}">
            <div class="fc-title">${f.name}</div>
            <div class="fc-info">
              <span>${f.cost}金</span>
              <span>${f.turns}回合</span>
            </div>
            <div class="fc-desc">${f.desc}</div>
            <div class="fc-effects">
              ${Object.entries(f.effects).map(([k,v]) => {
                const sign = v > 0 ? '+' : '';
                return `<span class="fe-tag ${v>0?'pos':'neg'}">${labels[k]||k} ${sign}${v}</span>`;
              }).join('')}
            </div>
            ${current ? `<div class="fc-cur">进行中 ${s.focusProgress}/${f.turns}</div>` : ''}
            ${lockReason ? `<div class="fc-lock">${lockReason}</div>` : ''}
            ${completed ? '<div class="fc-done">✓ 已完成</div>' : ''}
          </div>`;
      }).join('');
      return `<div class="focus-branch"><h4 class="fb-title">${branchName}</h4><div class="fb-cards">${cards}</div></div>`;
    };

    const html = `
      <div class="industry-header">
        <h2>国策树</h2>
        <div style="font-size:12px;color:var(--text-muted)">选择国策执行，完成后获得加成</div>
      </div>
      ${currentFocusHtml}
      ${Object.entries(branches).map(([name, foci]) => renderBranch(name, foci)).join('')}
    `;

    setTimeout(() => {
      document.querySelectorAll('.focus-card.available').forEach(card => {
        card.onclick = () => {
          const result = Game.startFocus(card.dataset.focus);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.requestRender();
        };
      });
    }, 0);

    return html;
  },

  getPolicyLockReason(opt) {
    if (opt.requires) {
      const ideologyNames = { reformist: '改革派', conservative: '保守派', militarist: '军国派', extremist: '极端派' };
      if (Game.state.leader.ideology !== opt.requires && !Game.state.flags[opt.requires]) {
        return `需要${ideologyNames[opt.requires] || opt.requires}路线`;
      }
    }
    if (opt.requiresFlag) {
      if (!Game.state.flags[opt.requiresFlag]) {
        return '需要前置事件解锁';
      }
    }
    return '条件不满足';
  },

  // ===== 科技页 =====
  renderTech() {
    const s = Game.state;
    const techs = Object.values(TECHS);
    const treeStatus = (typeof Game.getTechTreeStatus === 'function') ? Game.getTechTreeStatus() : null;

    // ===== 新科技树面板 (四类×时代解锁) =====
    let treeHtml = '';
    if (treeStatus && treeStatus.trees) {
      const statusColor = { done: '#4a8a4a', available: '#e8c860', locked: '#5a5a5a', era_locked: '#3a3a3a' };
      const statusLabel = { done: '✓已掌握', available: '可研发', locked: '锁定', era_locked: '时代未到' };
      treeHtml = `
        <div style="background:linear-gradient(135deg,rgba(168,50,50,0.08),rgba(60,30,30,0.03));border:1px solid var(--border);border-radius:6px;padding:14px;margin-bottom:14px;">
          <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);letter-spacing:0.1em;margin:0 0 4px;">科技树</h2>
          <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">
            四类科技 × 时代解锁 · 当前 ${s.year}年 · 研发点数: <span style="color:var(--accent-gold);font-weight:bold;">${Math.round(s.resources.research)}</span>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;">
            ${Object.keys(treeStatus.trees).map(treeId => {
              const t = treeStatus.trees[treeId];
              return `
                <div style="background:var(--bg-panel);border:1px solid var(--border);border-radius:6px;padding:10px;">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;border-bottom:1px solid var(--border);padding-bottom:6px;">
                    <span style="font-family:var(--font-serif);color:${t.color};font-size:13px;font-weight:bold;">${t.icon} ${t.name}</span>
                    <span style="font-size:10px;color:var(--text-muted);">Lv.${t.currentTier}/5</span>
                  </div>
                  <div style="font-size:10px;line-height:1.5;">
                    ${t.tiers.map(tier => {
                      const sc = statusColor[tier.status];
                      const sl = statusLabel[tier.status];
                      const isAvail = tier.status === 'available';
                      const canAfford = s.resources.research >= tier.cost;
                      return `
                        <div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px dashed rgba(255,255,255,0.04);">
                          <div style="flex:1;min-width:0;">
                            <div style="color:${tier.status === 'done' ? sc : (tier.status === 'available' ? t.color : 'var(--text-muted)')};font-size:11px;">
                              ${tier.status === 'done' ? '✓' : (tier.status === 'available' ? '▶' : '🔒')} ${tier.tier}.${tier.name}
                            </div>
                            <div style="font-size:9px;color:var(--text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${tier.desc}</div>
                          </div>
                          <div style="text-align:right;min-width:60px;">
                            <div style="font-size:9px;color:var(--text-muted);">${tier.eraName || ''} ${tier.cost}💰</div>
                            ${isAvail
                              ? `<button class="btn btn-build" data-tree="${treeId}" ${canAfford ? '' : 'disabled'} style="padding:2px 8px;font-size:10px;margin-top:2px;">研发</button>`
                              : `<span style="font-size:9px;color:${sc};">${sl}</span>`
                            }
                          </div>
                        </div>`;
                    }).join('')}
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>`;
    }

    const html = `
      ${treeHtml}
      <div class="industry-header">
        <h2>特殊科技</h2>
        <div style="font-size:12px;color:var(--text-secondary)">研发点数: <span style="color:var(--accent-gold);font-family:var(--font-mono)">${Math.round(s.resources.research)} 研发</span></div>
      </div>
      <div class="building-grid">
        ${techs.map(t => {
          const done = s.techs[t.id];
          const canResearch = !done && s.resources.research >= t.cost;
          return `
            <div class="building-card civilian ${done ? 'tech-done' : ''}">
              <div class="b-name">${t.name} ${done ? '<span style="color:var(--accent-toxic);font-size:11px;margin-left:6px">✓ 已研发</span>' : ''}</div>
              <div class="b-desc">${t.desc}</div>
              <div class="b-stats">
                ${done
                  ? `<span class="b-stat">研发成本 ${t.cost} 研发</span>`
                  : `<span class="b-stat cost">研发 ${t.cost} 研发</span>`
                }
              </div>
              <div class="b-actions">
                ${done
                  ? '<button class="btn btn-build" disabled>已完成</button>'
                  : `<button class="btn btn-build" data-tech="${t.id}" ${canResearch ? '' : 'disabled'}>研发</button>`
                }
              </div>
            </div>`;
        }).join('')}
      </div>
    `;

    setTimeout(() => {
      document.querySelectorAll('[data-tech]').forEach(btn => {
        btn.onclick = () => {
          const result = Game.researchTech(btn.dataset.tech);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.requestRender();
        };
      });
      // 新科技树研发按钮
      document.querySelectorAll('[data-tree]').forEach(btn => {
        btn.onclick = () => {
          const result = Game.researchTech(btn.dataset.tree);
          this.toast(result.msg, result.ok ? 'success' : 'error');
          this.requestRender();
        };
      });
    }, 0);

    return html;
  },

  // ===== 商店页 =====
  // ===== 黑市掮客 / 对话式商店 =====
  _shopGetSteiner() {
    if (!this._shopSteiner) {
      const year = Game.state.year;
      const greetings = [
        `* 上校先生，您来了。雪茄已经切好，放在桌上。`,
        `* （他从堆着文件的办公桌后抬头）帝国需要什么，直接说。`,
        `* 先生，门从里面反锁了。这里很安全。`,
        `* （他点燃了一支烟，指了指椅子）坐。 ${year}年了，我这地下仓库堆满了好东西。`,
        `* （他瞥了眼角落里的党卫军军帽）别担心，我已经退休，这里只做生意。`
      ];
      this._shopSteiner = {
        greeting: greetings[Math.floor(Math.random() * greetings.length)]
      };
    }
    return this._shopSteiner;
  },

  get _shopChatOptions() {
    return [
      { id: 'greet', text: '打招呼', reply: `* （他微微点头）老客户了，不用客套。` },
      { id: 'what', text: '这里能做什么', reply: `* 应急物资、军火、情报，偶尔还能帮您搞点钱。当然——按老规矩，等价交换。` },
      { id: 'story', text: '你的故事', reply: `* （他沉默片刻，指了指脸上的旧伤疤）东方总计划撤退时留下的。现在嘛…帮帝国做些桌面上不方便的事。` },
      { id: 'life', text: '你的生活', reply: `* （他笑了笑）每天早上九点开门，凌晨两点关门。和盖世太保的查岗时间错开——这是我多年的生存智慧。` },
      { id: 'advise', text: '有什么建议', reply: (() => {
        const s = Game.state;
        if (s.resources.stability < 15) return `* 稳定度太低了。先维稳，否则哪天早上您的名字就会出现在绞刑名单上。`;
        if (s.resources.deterrence < 10) return `* 外面盛传帝国快不行了。威慑力撑住了吗？不然美国佬会先动手。`;
        if (s.year >= 1985 && s.resources.nukes < 3) return `* 听我一句，核弹准备好。1989年…那不是普通人能睡安稳觉的一年。`;
        return `* （耸耸肩）您的帝国您最清楚。但记住——现金永远比承诺可靠。`;
      })() }
    ];
  },

  get _shopOpenBoxPool() {
    return [
      { name: '意外好运', desc: '一位匿名贵族的捐款。', effect: { money: +60, stability: +2 } },
      { name: '情报截获', desc: '破译了一份同盟国电报。', effect: { research: +8, deterrence: +3 } },
      { name: '军火被查抄', desc: '盖世太保扣了您一批货。', effect: { money: -40, militaryPower: -4 } },
      { name: '黑市涨价', desc: '近期物价暴涨。', effect: { money: -20 } },
      { name: '党卫军老朋友', desc: '希姆莱旧部带来了见面礼。', effect: { militaryPower: +6, stability: -2 } },
      { name: '科研蓝图', desc: '从瑞士搞到了民用技术图纸。', effect: { research: +12 } },
      { name: '铀矿小批量', desc: '从刚果走私的一公斤铀。', effect: { nukeDeter: +3, nukes: +1 } },
      { name: '民众暴动', desc: '占领区又闹了点小麻烦。', effect: { stability: -4, deterrence: -2 } },
      { name: '老兵捐款', desc: '一战老战友集体募捐。', effect: { manpower: +25, stability: +3 } },
      { name: '勃艮第密信', desc: '希姆莱那边来了封信…打开前先深呼吸。', effect: { deterrence: +6, burgundy_relation: +10 } }
    ];
  },

  renderShop() {
    this._shopGetSteiner(); // 初始化施坦纳台词
    const s = Game.state;
    const r = s.resources;
    const isDebug = this.isDebugMode();
    if (!this._shopView) this._shopView = 'main'; // main | buy:<cat> | openbox | chat
    if (!this._shopDialog) this._shopDialog = this._shopSteiner.greeting;

    // ===== 商品总表（按分类） =====
    const diff = DIFFICULTIES[s.difficulty] || DIFFICULTIES.normal;
    const loanRate = Math.round(diff.loanInterest * 100);
    const loanDue = Math.round(120 * (1 + diff.loanInterest));
    const loanDisabled = s.flags.loan_active || s.flags.loan_cooldown;
    const loanTag = s.flags.loan_active ? '进行中' : (s.flags.loan_cooldown ? `违约冷却(${s.flags.loan_cooldown}回合)` : '');

    const CATEGORIES = {
      emergency: {
        name: '应急物资',
        items: [
          { id: 'shop_stab', name: '维稳拨款', desc: '派遣党卫军巡逻队，恢复秩序。', cost: { money: 80 }, gain: { stability: 5 }, icon: '⚖' },
          { id: 'shop_recruit', name: '征兵动员', desc: '在占领区强制征兵。', cost: { money: 60 }, gain: { manpower: 15 }, icon: '👥' },
          { id: 'shop_propa', name: '宣传套餐', desc: '戈培尔亲自操刀的宣传攻势。', cost: { money: 70 }, gain: { stability: 3, deterrence: 2 }, icon: '📻' }
        ]
      },
      arms: {
        name: '军备供应',
        items: [
          { id: 'shop_det', name: '军事演习', desc: '在东部边境举行大规模演习，展示武力。', cost: { money: 120, manpower: 25 }, gain: { deterrence: 5 }, icon: '⚔' },
          { id: 'shop_mil', name: '雇佣兵合同', desc: '从海外招募职业军人。', cost: { money: 180 }, gain: { militaryPower: 8 }, icon: '🎖' },
          { id: 'shop_nuke', name: '核材料采购', desc: '从铀矿采购浓缩铀。', cost: { money: 250, research: 25 }, gain: { nukeDeter: 5, nukes: 1 }, icon: '☢', reqFlag: 'nuclear_tech' }
        ]
      },
      intel: {
        name: '情报科研',
        items: [
          { id: 'shop_res', name: '科研资助', desc: '向帝国大学拨发专项经费。', cost: { money: 150 }, gain: { research: 6 }, icon: '🔬' }
        ]
      },
      finance: {
        name: '金融渠道',
        items: [
          { id: 'shop_loan', name: '帝国债券', desc: `发行战争债券，换取120资金。<strong>5年后偿还本金+利息</strong>（当前难度利率${loanRate}%，到期还${loanDue}）。${loanTag ? `<span style="color:#e8a030;">${loanTag}</span>` : ''}`, cost: { stability: -5 }, gain: { money: 120 }, icon: '💰', reqNoLoan: loanDisabled }
        ]
      }
    };

    // ===== 借贷状态面板（进入金融分类时显示） =====
    let loanPanel = '';
    if (s.flags.loan_active) {
      const yearsLeft = Math.ceil(s.flags.loan_remaining / 4);
      const due = s.flags.loan_total_due || 180;
      const canRepay = r.money >= due;
      loanPanel = `
        <div style="margin:10px 0;padding:10px;border:1px solid #e74c3c;border-radius:6px;background:rgba(231,76,60,0.08);">
          <div style="font-weight:bold;color:#e74c3c;margin-bottom:4px;font-size:12px;">💰 债券状态</div>
          <div style="font-size:11px;color:var(--text-muted);line-height:1.6;">
            借${s.flags.loan_amount||120} · 还<strong style="color:#e74c3c;">${due}</strong><br>剩余 ${yearsLeft} 年 (${s.flags.loan_remaining}回合)
          </div>
          <button data-loan-repay="1" ${canRepay ? '' : 'disabled'}
            style="margin-top:6px;padding:4px 12px;border-radius:3px;font-size:11px;cursor:${canRepay ? 'pointer' : 'not-allowed'};background:${canRepay ? '#e74c3c' : 'var(--bg-dark)'};color:white;border:none;">
            ${canRepay ? `提前偿还 (${due})` : `资金不足`}
          </button>
        </div>
      `;
    }

    // ===== 渲染左侧：对话气泡 =====
    const dialogHtml = `<div class="shop-dialog-bubble">${this._shopDialog}</div>`;

    // ===== 渲染右侧：菜单选项 =====
    let menuHtml = '';
    let menuTitle = '';

    if (this._shopView === 'main') {
      menuTitle = '你想做点什么？';
      const openBoxAfford = r.money >= 60;
      menuHtml = this._renderShopMenuItems([
        { key: 'buy', label: '购买物资', sub: '应急/军备/情报/金融', cmd: `shop-enter-buy` },
        { key: 'box', label: '黑箱抽卡', sub: `花费 60 资金 · 随机好货或踩雷 · ${openBoxAfford ? '' : '（资金不足）'}`, cmd: `shop-openbox`, disabled: !openBoxAfford },
        { key: 'chat', label: '闲聊几句', sub: '问问建议或听听故事', cmd: `shop-chat-menu` },
        { key: 'leave', label: '离开', sub: '回到帝国政务', cmd: `shop-leave` }
      ]);
    } else if (this._shopView.startsWith('buy:')) {
      const catId = this._shopView.split(':')[1];
      const cat = CATEGORIES[catId];
      menuTitle = cat ? cat.name : '购买物资';
      // 先加个返回按钮
      let items = [{ key: 'back', label: '‹ 返回分类', sub: '回到主菜单', cmd: `shop-view-main` }];
      if (cat) {
        for (const it of cat.items) {
          if (it.reqFlag && !s.flags[it.reqFlag]) {
            items.push({ key: it.id, label: `🔒 ${it.name}`, sub: `需要科技解锁`, cmd: '', disabled: true });
            continue;
          }
          if (it.id === 'shop_loan' && loanDisabled) {
            items.push({ key: it.id, label: it.name, sub: it.desc, cmd: '', disabled: true, raw: it });
            continue;
          }
          const canAfford = Object.entries(it.cost).every(([k, v]) => (r[k] || 0) + v >= 0);
          items.push({ key: it.id, label: it.name, sub: it.desc, cmd: `shop-buy:${it.id}`, disabled: !canAfford, raw: it });
        }
      }
      menuHtml = this._renderShopMenuItems(items, true);
    } else if (this._shopView === 'buy-cats') {
      menuTitle = '请选择分类';
      const cats = [
        { key: 'emergency', label: '🩹 应急物资', sub: '维稳 / 征兵 / 宣传', cmd: `shop-buy-cat:emergency` },
        { key: 'arms', label: '🛡 军备供应', sub: '演习 / 雇佣兵 / 核材料', cmd: `shop-buy-cat:arms` },
        { key: 'intel', label: '🔬 情报科研', sub: '科研资助', cmd: `shop-buy-cat:intel` },
        { key: 'finance', label: '💰 金融渠道', sub: '帝国债券', cmd: `shop-buy-cat:finance` }
      ];
      menuHtml = this._renderShopMenuItems([
        { key: 'back', label: '‹ 返回', sub: '回到主菜单', cmd: `shop-view-main` },
        ...cats
      ]);
    } else if (this._shopView === 'openbox') {
      menuTitle = '黑箱抽卡';
      menuHtml = this._renderShopMenuItems([
        { key: 'back', label: '‹ 返回', sub: '回到主菜单', cmd: `shop-view-main` },
        { key: 'confirm', label: '🎲 抽一次', sub: '花费 60 资金 · 结果完全随机', cmd: `shop-openbox-do`, disabled: r.money < 60 }
      ]);
    } else if (this._shopView === 'chat') {
      menuTitle = '闲聊';
      const items = this._shopChatOptions.map(o => ({
        key: o.id, label: o.text, sub: '', cmd: `shop-chat:${o.id}`
      }));
      menuHtml = this._renderShopMenuItems([
        { key: 'back', label: '‹ 返回', sub: '回到主菜单', cmd: `shop-view-main` },
        ...items
      ]);
    }

    // 金融分类：在商品列表上方附借贷状态面板
    if (this._shopView === 'buy:finance') {
      menuHtml = loanPanel + menuHtml;
    }

    // 老板信息条
    const moneyLine = `资金 ${Math.round(r.money)}`;

    return `
      <div class="shop-container" id="shop-npc-wrap">
        <!-- 老板场景 / 立绘区 -->
        <div class="shop-scene">
          <div class="shop-scene-bg"></div>
          <div class="shop-scene-content">
            <div class="shop-boss">
              <div class="shop-boss-avatar">
                <div style="font-size:48px;line-height:1;">🎩</div>
              </div>
              <div class="shop-boss-meta">
                <div class="sb-name">施坦纳</div>
                <div class="sb-title">前党卫军上校 · 黑市掮客</div>
                <div class="sb-money">${moneyLine}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 对话框 / 菜单 左右分栏 -->
        <div class="shop-body">
          <div class="shop-dialog">
            ${dialogHtml}
            <div style="font-size:10px;color:var(--text-muted);margin-top:10px;text-align:right;">
              ${s.year}年 · 柏林地下仓库
            </div>
          </div>
          <div class="shop-menu">
            <div class="shop-menu-title">› ${menuTitle}</div>
            <div class="shop-menu-list">
              ${menuHtml}
            </div>
          </div>
        </div>

        ${isDebug ? this.renderDebugPanel() : `
          <div class="shop-footer-npc">
            <div style="font-size:11px;color:var(--text-muted);padding-top:8px;border-top:1px solid var(--border);">
              帝国总理府 · 物资调配司 / 外部联络人
            </div>
            <div style="margin-top:8px;">
              <input type="password" id="shop-code-input" placeholder="授权码"
                style="background:var(--bg-dark);border:1px solid var(--border);color:var(--text-muted);padding:5px 8px;border-radius:3px;font-size:11px;width:120px;font-family:var(--font-mono);" />
              <button id="shop-code-btn"
                style="background:transparent;border:1px solid var(--border);color:var(--text-muted);padding:5px 10px;border-radius:3px;font-size:11px;cursor:pointer;">验证</button>
            </div>
          </div>
        `}
      </div>
    `;
  },

  _renderShopMenuItems(items, withDetail = false) {
    return items.map(it => {
      let costGain = '';
      if (withDetail && it.raw) {
        const labels = { money: '资金', manpower: '人力', stability: '稳定', deterrence: '威慑', militaryPower: '军力', nukeDeter: '核慑', research: '研发', nukes: '核弹' };
        const costParts = Object.entries(it.raw.cost).map(([k, v]) => `${labels[k] || k} ${v > 0 ? '-' : '+'}${Math.abs(v)}`).join(' ');
        const gainParts = Object.entries(it.raw.gain).map(([k, v]) => `+${v} ${labels[k] || k}`).join(' ');
        costGain = `<div class="sm-detail">${costParts}　<span style="color:#4a8a4a;">⇒ ${gainParts}</span></div>`;
      }
      const cls = it.disabled ? 'sm-item disabled' : 'sm-item';
      return `
        <div class="${cls}" data-sm-cmd="${it.cmd || ''}" ${it.disabled ? 'style="opacity:0.5;pointer-events:none;"' : ''}>
          <div class="sm-arrow">▸</div>
          <div class="sm-body">
            <div class="sm-label">${it.label}</div>
            ${it.sub ? `<div class="sm-sub">${it.sub}</div>` : ''}
            ${costGain}
          </div>
        </div>
      `;
    }).join('');
  },

  // ===== 商店事件绑定 =====
  bindShopEvents() {
    const wrap = document.getElementById('shop-npc-wrap');
    if (!wrap) {
      // fallback: 兼容旧商品卡片（如果有）
      document.querySelectorAll('[data-shop-buy]').forEach(btn => {
        btn.onclick = () => this.shopBuy(btn.dataset.shopBuy);
      });
      return;
    }

    // 菜单项点击（不要碰 mousedown/touchstart，会阻止页面/菜单的触摸滚动导致"卡住"）
    wrap.querySelectorAll('[data-sm-cmd]').forEach(el => {
      el.onclick = (e) => {
        e.stopPropagation();
        this._shopHandleCmd(el.dataset.smCmd);
      };
    });

    // 借贷还款
    const repayBtn = document.querySelector('[data-loan-repay]');
    if (repayBtn) {
      repayBtn.onclick = () => {
        const s = Game.state;
        if (!s.flags.loan_active) return;
        const due = s.flags.loan_total_due || 180;
        if (s.resources.money < due) { this.toast('资金不足', 'error'); return; }
        s.resources.money -= due;
        s.flags.loan_active = false;
        delete s.flags.loan_cooldown;
        this.addNews(`帝国债券已提前偿还，支付 ${due} 资金`, 'economy');
        this._shopDialog = `* 现金交易。${due} 资金，一分不差。债券结清。`;
        this.toast(`已偿还 ${due} 资金`, 'success');
        this.requestRender();
        this.autoSave();
      };
    }

    // 密码
    const codeBtn = document.getElementById('shop-code-btn');
    const codeInput = document.getElementById('shop-code-input');
    if (codeBtn && codeInput) {
      codeBtn.onclick = () => this.checkShopCode();
      codeInput.onkeydown = (e) => { if (e.key === 'Enter') this.checkShopCode(); };
    }
  },

  _shopHandleCmd(cmd) {
    if (!cmd) return;
    if (cmd === 'shop-leave') {
      this._shopView = 'main';
      this._shopDialog = this._shopSteiner.greeting;
      this.renderTab('overview');
      return;
    }
    if (cmd === 'shop-view-main') { this._shopView = 'main'; this._shopDialog = `* （他重新靠在椅背上）还有什么吩咐？`; this.requestRender(); return; }
    if (cmd === 'shop-enter-buy') { this._shopView = 'buy-cats'; this._shopDialog = `* 看对什么就说。东西都是正路，只是…不上账面。`; this.requestRender(); return; }
    if (cmd === 'shop-openbox') { this._shopView = 'openbox'; this._shopDialog = `* （他从柜台下拉出一个蒙尘的木箱）60资金。抽一次，手气好不好都不退。`; this.requestRender(); return; }
    if (cmd === 'shop-chat-menu') { this._shopView = 'chat'; this._shopDialog = `* （他又点了支烟）想问什么？别太敏感就行。`; this.requestRender(); return; }
    if (cmd.startsWith('shop-buy-cat:')) {
      const cat = cmd.split(':')[1];
      this._shopView = 'buy:' + cat;
      const catNames = { emergency: '应急物资', arms: '军备供应', intel: '情报科研', finance: '金融渠道' };
      this._shopDialog = `* ${catNames[cat] || '这一类'}…您要的都在清单里，挑吧。`;
      this.requestRender();
      return;
    }
    if (cmd.startsWith('shop-buy:')) {
      const id = cmd.split(':')[1];
      this.shopBuy(id);
      return;
    }
    if (cmd === 'shop-openbox-do') {
      this._shopOpenBox();
      return;
    }
    // 同视图内切换（闲聊选项等）：只更对话文字，不重建 HTML，避免滚动跳动
    if (cmd.startsWith('shop-chat:')) {
      const id = cmd.split(':')[1];
      const opt = this._shopChatOptions.find(o => o.id === id);
      if (opt) {
        this._shopDialog = typeof opt.reply === 'function' ? opt.reply() : opt.reply;
        this._shopPatchDialog();
      }
      return;
    }
  },

  // 仅更新对话气泡内容，不重建商店 HTML，不触发滚动
  _shopPatchDialog() {
    const tc = document.getElementById('tab-content');
    const savedTop = tc ? tc.scrollTop : 0;
    const savedMenu = document.querySelector('.shop-menu-list')?.scrollTop || 0;
    const bubble = document.querySelector('.shop-dialog-bubble');
    if (bubble) {
      bubble.innerHTML = this._shopDialog;
      // 强制恢复滚动位置，防止浏览器因焦点/重排导致跳动
      if (tc) {
        tc.scrollTop = savedTop;
        const ml = document.querySelector('.shop-menu-list');
        if (ml) ml.scrollTop = savedMenu;
        requestAnimationFrame(() => {
          tc.scrollTop = savedTop;
          const ml2 = document.querySelector('.shop-menu-list');
          if (ml2) ml2.scrollTop = savedMenu;
        });
      }
    } else {
      this.requestRender();
    }
  },

  _shopOpenBox() {
    const s = Game.state;
    const r = s.resources;
    if (r.money < 60) { this.toast('资金不足', 'error'); return; }
    r.money -= 60;
    const roll = this._shopOpenBoxPool[Math.floor(Math.random() * this._shopOpenBoxPool.length)];
    const labels = { money: '资金', manpower: '人力', stability: '稳定', deterrence: '威慑', militaryPower: '军力', nukeDeter: '核慑', research: '研发', nukes: '核弹', burgundy_relation: '勃艮第关系' };
    for (const [k, v] of Object.entries(roll.effect)) {
      if (k === 'burgundy_relation') { s.relations.burgundy = Math.max(-100, Math.min(100, (s.relations.burgundy || 0) + v)); continue; }
      r[k] = (r[k] || 0) + v;
    }
    Game.clampResources();
    const eff = Object.entries(roll.effect).map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${labels[k] || k}`).join('  ');
    this._shopDialog = `* （他从箱里摸出个东西递给你）<strong style="color:#e8c860;">「${roll.name}」</strong> — ${roll.desc}<br><span style="color:#bbb;">结果：${eff}</span>`;
    this.addNews(`黑市抽卡·${roll.name}：${eff}`, 'economy');
    this.toast(`抽卡：${roll.name}`, 'success');
    this._shopPatchDialog();
    this.renderTopbar();
    this.autoSave();
  },

  checkShopCode() {
    const input = document.getElementById('shop-code-input');
    if (!input) return;
    const val = (input.value || '').trim().toUpperCase();
    if (val === 'WOLFSCHANZE') {
      sessionStorage.setItem('tno_debug', '1');
      this.toast('授权成功。开发者模式已激活。', 'success');
      this.renderTab('shop');
    } else {
      this.toast('授权码无效', 'error');
      input.value = '';
    }
  },

  shopBuy(id) {
    const s = Game.state;
    const r = s.resources;
    const shopItems = {
      shop_stab: { cost: { money: 80 }, gain: { stability: 5 } },
      shop_det: { cost: { money: 120, manpower: 25 }, gain: { deterrence: 5 } },
      shop_mil: { cost: { money: 180 }, gain: { militaryPower: 8 } },
      shop_res: { cost: { money: 150 }, gain: { research: 6 } },
      shop_nuke: { cost: { money: 250, research: 25 }, gain: { nukeDeter: 5, nukes: 1 } },
      shop_recruit: { cost: { money: 60 }, gain: { manpower: 15 } },
      shop_loan: { cost: { stability: -5 }, gain: { money: 120 } },
      shop_propa: { cost: { money: 70 }, gain: { stability: 3, deterrence: 2 } }
    };
    const item = shopItems[id];
    if (!item) return;

    // 借贷限制：有未偿还债券或在冷却期内不可发行
    if (id === 'shop_loan') {
      if (s.flags.loan_active) {
        this.toast('已有未偿还债券，无法再次发行', 'error');
        return;
      }
      if (s.flags.loan_cooldown) {
        this.toast(`冷却中，还需 ${s.flags.loan_cooldown} 年`, 'error');
        return;
      }
    }

    // 检查资源
    for (const [k, v] of Object.entries(item.cost)) {
      if ((r[k] || 0) + v < 0) {
        this.toast('资源不足', 'error');
        return;
      }
    }
    // 扣除
    for (const [k, v] of Object.entries(item.cost)) {
      r[k] = (r[k] || 0) - v;
    }
    // 增加
    for (const [k, v] of Object.entries(item.gain)) {
      if (k === 'stability') r[k] = Math.min(100, (r[k] || 0) + v);
      else r[k] = (r[k] || 0) + v;
    }

    // 借贷特殊处理：5年（20回合）后到期，利率按难度
    if (id === 'shop_loan') {
      const diff = DIFFICULTIES[s.difficulty] || DIFFICULTIES.normal;
      const rate = diff.loanInterest;
      const amount = 120;
      const interest = Math.round(amount * rate);
      const totalDue = amount + interest;
      s.flags.loan_active = true;
      s.flags.loan_remaining = 20;   // 5年 = 20回合
      s.flags.loan_amount = amount;  // 借款金额
      s.flags.loan_interest = interest; // 利息（按难度）
      s.flags.loan_total_due = totalDue; // 总需偿还
      this._shopDialog = `* （他在账本上签了字，把一叠钞票推过来）<strong style="color:#e8c860;">${amount}</strong> 资金，5年后还 ${totalDue}。别让我上门讨债。`;
      this.toast(`债券发行成功！5年后需偿还${totalDue}资金（本金${amount}+利息${interest}，利率${Math.round(rate*100)}%）`, 'success');
    } else {
      const lines = {
        shop_stab: `* 巡逻队已经派出去了。您这就看明天的报纸——柏林街头会清净不少。`,
        shop_det: `* 东部边境的装甲师已经就位。美国人的卫星拍不到什么，但他们能感觉到。`,
        shop_mil: `* （他翻了翻一本黑色名册）南非和西班牙的老兵，明天上午到新兵营报到。`,
        shop_res: `* 帝国大学收到经费了，院长亲自拍了电报——说「决不辜负元首」。`,
        shop_nuke: `* （他压低声音）刚果的货，三艘潜艇秘密运送。千万别让盖世太保查到记录。`,
        shop_recruit: `* 占领区那边已经安排好了。今天下午火车站就有新人送过来。`,
        shop_propa: `* 戈培尔博士亲自操刀。明天全帝国电台同时广播，内容包您满意。`
      };
      this._shopDialog = lines[id] || `* 货已交割。下一位。`;
      this.toast('购买成功', 'success');
    }

    Game.clampResources();
    this._shopPatchDialog();
    this.renderTopbar();
    this.renderLeftPanel();
    this.renderRightPanel();
    this.autoSave();
  },

  // ===== Debug 面板渲染（商店内） =====
  renderDebugPanel() {
    return `
      <div style="margin-top:24px;padding:16px;border:1px solid var(--accent-gold);border-radius:8px;background:rgba(168,50,50,0.05);">
        <div style="color:var(--accent-gold);font-weight:bold;margin-bottom:12px;">⚙ 开发者控制台</div>
        <div style="display:grid;gap:8px;">
          <div style="font-size:11px;color:var(--text-muted);">资源调整</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <button class="dbg-btn" data-dbg-act="money100">+100 资金</button>
            <button class="dbg-btn" data-dbg-act="money500">+500 资金</button>
            <button class="dbg-btn" data-dbg-act="mp50">+50 人力</button>
            <button class="dbg-btn" data-dbg-act="mp200">+200 人力</button>
            <button class="dbg-btn" data-dbg-act="stab20">+20 稳定</button>
            <button class="dbg-btn" data-dbg-act="det20">+20 威慑</button>
            <button class="dbg-btn" data-dbg-act="mil30">+30 军力</button>
            <button class="dbg-btn" data-dbg-act="nuk20">+20 核慑</button>
            <button class="dbg-btn" data-dbg-act="res20">+20 研发</button>
            <button class="dbg-btn" data-dbg-act="nuke5">+5 核弹</button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">时间控制</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <button class="dbg-btn" data-dbg-act="skip4">跳4回合</button>
            <button class="dbg-btn" data-dbg-act="skip16">跳16回合</button>
            <button class="dbg-btn" data-dbg-act="goto1980">跳到1980</button>
            <button class="dbg-btn" data-dbg-act="goto2000">跳到2000</button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">国策 / 科技</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <button class="dbg-btn" data-dbg-act="focus">秒完当前国策</button>
            <button class="dbg-btn" data-dbg-act="allfocus">完成所有国策</button>
            <button class="dbg-btn" data-dbg-act="techs">解锁所有科技</button>
            <button class="dbg-btn" data-dbg-act="flags">解锁所有标记</button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">其他</div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
            <button class="dbg-btn" data-dbg-act="relation">关系全+50</button>
            <button class="dbg-btn" data-dbg-act="russia">俄罗斯立即统一</button>
            <button class="dbg-btn" data-dbg-act="maxall">资源全满</button>
            <button class="dbg-btn" data-dbg-act="reset">资源清零</button>
          </div>
          <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">查看状态</div>
          <button class="dbg-btn" data-dbg-act="dump">输出状态到控制台</button>
        </div>
      </div>
    `;
  },

  // ===== 事件日志页 =====
  renderEventLog() {
    const s = Game.state;
    if (s.eventLog.length === 0) {
      return '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:40px">尚无重大事件记录</div>';
    }
    return `
      <div class="events-feed">
        ${s.eventLog.map(e => `
          <div class="event-card major">
            <div class="e-date">${e.date}</div>
            <div class="e-title">${e.title}</div>
            <div class="e-desc">抉择: <em style="color:var(--accent-gold)">${e.choice}</em></div>
          </div>
        `).join('')}
      </div>
    `;
  },

  // ===== 下一回合 =====
  nextTurn() {
    if (Game.state.ended) return;
    const btn = document.getElementById('btn-next-turn');
    const mBtn = document.getElementById('m-btn-next');
    if (btn) { btn.disabled = true; btn.textContent = '处理中...'; }
    if (mBtn) { mBtn.disabled = true; mBtn.textContent = '处理中...'; }

    // 暂存待处理事件队列
    this.pendingEvents = [];

    const result = Game.advanceTurn([], (events) => {
      this.pendingEvents = events;
    });

    this.requestRender();

    // 自动保存
    this.autoSave();

    // 处理事件
    if (this.pendingEvents.length > 0) {
      this.currentEventIndex = 0;
      this.showNextEvent();
    } else if (Game.state.ended) {
      this.showEnding();
    } else {
      if (btn) { btn.disabled = false; btn.textContent = '推进至下一季度 ▸'; }
      if (mBtn) { mBtn.disabled = false; mBtn.textContent = '下一季度 ▸'; }
    }
  },

  // ===== 处理本回合事件 =====
  processTurnEvents() {
    // 开场触发第一回合事件
    const events = Game.getEventsForTurn();
    if (events.length > 0) {
      this.pendingEvents = events;
      this.currentEventIndex = 0;
      this.showNextEvent();
    }
  },

  // ===== 显示下一个事件 =====
  showNextEvent() {
    if (this.currentEventIndex >= this.pendingEvents.length) {
      // 所有事件处理完毕
      this.pendingEvents = [];
      // 事件处理完后自动保存
      this.autoSave();
      if (Game.state.ended) {
        this.showEnding();
      } else {
        const btn = document.getElementById('btn-next-turn');
        const mBtn = document.getElementById('m-btn-next');
        if (btn) { btn.disabled = false; btn.textContent = '推进至下一季度 ▸'; }
        if (mBtn) { mBtn.disabled = false; mBtn.textContent = '下一季度 ▸'; }
        this.requestRender();
      }
      return;
    }

    const ev = this.pendingEvents[this.currentEventIndex];
    this.showEventModal(ev);
  },

  // ===== 显示事件弹窗 =====
  // ===== 事件历史插画（按关键词匹配，SVG内联生成） =====
  _getEventImage(ev) {
    const text = ((ev.title || '') + ' ' + (ev.body || '')).toLowerCase();
    const id = (ev.id || '').toLowerCase();

    // 优先使用真实历史风格图片（按事件ID精确映射）
    const realImages = {
      // 登月/太空
      'ev_moon_landing': 'img/events/ev_moon_landing.jpg',
      'ev_space_race_2': 'img/events/ev_moon_landing.jpg',
      'ev_us_space_program_1975': 'img/events/ev_moon_landing.jpg',
      'ev_space_race_mars': 'img/events/ev_moon_landing.jpg',
      'ev_mars_landing': 'img/events/ev_moon_landing.jpg',
      'ev_space_station': 'img/events/ev_moon_landing.jpg',
      // 刺杀/死亡
      'ev_hitler_assassinated': 'img/events/ev_hitler_assassinated.jpg',
      'ev_hitler_death': 'img/events/ev_hitler_death.jpg',
      'ev_us_kennedy_assassination': 'img/events/ev_hitler_assassinated.jpg',
      // 继承
      'ev_succession_announcement': 'img/events/ev_succession_announcement.jpg',
      'ev_choose_successor': 'img/events/ev_succession_announcement.jpg',
      // 内战
      'ev_civil_war_battles': 'img/events/ev_civil_war_battles.jpg',
      'ev_civil_war_burgundy': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_civil_war_climax': 'img/events/ev_civil_war_battles.jpg',
      'ev_civil_war_end': 'img/events/ev_civil_war_battles.jpg',
      'ev_civil_war_colonial_crack': 'img/events/ev_civil_war_battles.jpg',
      'ev_us_second_civil_war': 'img/events/ev_us_civil_unrest.jpg',
      'ev_french_civil_war': 'img/events/ev_civil_war_battles.jpg',
      'ev_iberian_civil_war_1978': 'img/events/ev_iberian_crisis.jpg',
      // 勃艮第
      'ev_burgundian_crisis': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_burgundian_war_result': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_burgundian_infiltration': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_burgundy_knights_state': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_burgundy_deep_infiltration': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_burgundy_nuclear_theft': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_burgundy_agents_ofn': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_burgundy_doomsday_discovery': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_burgundy_nuclear_test': 'img/events/ev_nuclear_arms_race.jpg',
      'ev_burgundy_confrontation': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_burgundy_aftermath': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_burgundy_remnant_terror': 'img/events/ev_civil_war_burgundy.jpg',
      'ev_burgundy_final_shadow': 'img/events/ev_civil_war_burgundy.jpg',
      // 经济
      'ev_economic_miracle_1970': 'img/events/ev_economic_miracle_1970.jpg',
      'ev_economic_bubble_1982': 'img/events/ev_economic_miracle_1970.jpg',
      'ev_economic_collapse_1975': 'img/events/ev_economic_miracle_1970.jpg',
      'ev_economic_globalization': 'img/events/ev_economic_miracle_1970.jpg',
      'ev_global_boom_1985': 'img/events/ev_economic_miracle_1970.jpg',
      'ev_brazil_economic_miracle': 'img/events/ev_economic_miracle_1970.jpg',
      'ev_french_occupation_costs': 'img/events/ev_economic_miracle_1970.jpg',
      'ev_manchukuo_industrialization': 'img/events/ev_economic_miracle_1970.jpg',
      'ev_black_market': 'img/events/ev_black_market.jpg',
      'ev_neutral_zone_blackmarket': 'img/events/ev_black_market.jpg',
      // 核武
      'ev_nuclear_arms_race': 'img/events/ev_nuclear_arms_race.jpg',
      'ev_nuclear_accident_germany': 'img/events/ev_nuclear_arms_race.jpg',
      'ev_chernobyl_equivalent': 'img/events/ev_nuclear_arms_race.jpg',
      'ev_nuclear_disarmament': 'img/events/ev_nuclear_arms_race.jpg',
      'ev_disarmament_geneva': 'img/events/ev_nuclear_arms_race.jpg',
      'ev_nuclear_near_miss': 'img/events/ev_third_world_war_crisis.jpg',
      'ev_third_world_war_crisis': 'img/events/ev_third_world_war_crisis.jpg',
      'ev_russia_nuclear_threat': 'img/events/ev_third_world_war_crisis.jpg',
      // 俄罗斯
      'ev_russia_reunification_threat': 'img/events/ev_russia_reunification_threat.jpg',
      'ev_russia_unified': 'img/events/ev_russia_unified.jpg',
      'ev_russia_warlords_1968': 'img/events/ev_russia_reunification_threat.jpg',
      'ev_russia_unification_type': 'img/events/ev_russia_reunification_threat.jpg',
      'ev_russia_democratic_unified': 'img/events/ev_russia_unified.jpg',
      'ev_russia_communist_unified': 'img/events/ev_russia_unified.jpg',
      'ev_russia_fascist_unified': 'img/events/ev_russia_unified.jpg',
      'ev_russia_madman_unified': 'img/events/ev_russia_unified.jpg',
      'ev_russia_recovery_1': 'img/events/ev_russia_unified.jpg',
      'ev_russia_recovery_2': 'img/events/ev_russia_unified.jpg',
      'ev_russia_pressure_1979': 'img/events/ev_russia_reunification_threat.jpg',
      'ev_taboritsky_collapses': 'img/events/ev_russia_reunification_threat.jpg',
      'ev_russia_monarchist_unified': 'img/events/ev_russia_unified.jpg',
      'ev_second_west_russian_war': 'img/events/ev_west_russia_remnants.jpg',
      'ev_west_russia_final': 'img/events/ev_west_russia_remnants.jpg',
      'ev_war_aftermath': 'img/events/ev_west_russia_remnants.jpg',
      'ev_russia_final_resolve': 'img/events/ev_russia_unified.jpg',
      'ev_wrrf_consolidation': 'img/events/ev_west_russia_remnants.jpg',
      'ev_komi_democratic_experiment': 'img/events/ev_west_russia_remnants.jpg',
      'ev_omsk_black_league': 'img/events/ev_west_russia_remnants.jpg',
      'ev_sverdlovsk_rokossovsky': 'img/events/ev_west_russia_remnants.jpg',
      'ev_tomsk_scholar_republic': 'img/events/ev_west_russia_remnants.jpg',
      'ev_siberian_black_army': 'img/events/ev_west_russia_remnants.jpg',
      'ev_magadan_warlord': 'img/events/ev_west_russia_remnants.jpg',
      'ev_amur_white_army': 'img/events/ev_west_russia_remnants.jpg',
      'ev_chita_monarchist': 'img/events/ev_west_russia_remnants.jpg',
      'ev_buryat_sablin': 'img/events/ev_west_russia_remnants.jpg',
      'ev_irktusk_yagoda': 'img/events/ev_west_russia_remnants.jpg',
      'ev_kemerovo_rurik': 'img/events/ev_west_russia_remnants.jpg',
      'ev_vyatka_monarchy': 'img/events/ev_west_russia_remnants.jpg',
      'ev_samara_vlasov': 'img/events/ev_west_russia_remnants.jpg',
      'ev_aryan_brotherhood': 'img/events/ev_west_russia_remnants.jpg',
      'ev_ural_border_war': 'img/events/ev_west_russia_remnants.jpg',
      'ev_russia_superregional_war': 'img/events/ev_russia_unified.jpg',
      'ev_tabortsy_purge': 'img/events/ev_west_russia_remnants.jpg',
      'ev_russia_tomsk_yagoda': 'img/events/ev_west_russia_remnants.jpg',
      'ev_russia_omsk_black_league': 'img/events/ev_west_russia_remnants.jpg',
      'ev_russia_komi_taboritsky': 'img/events/ev_west_russia_remnants.jpg',
      'ev_russia_magadan': 'img/events/ev_west_russia_remnants.jpg',
      'ev_russia_wrrf': 'img/events/ev_west_russia_remnants.jpg',
      'ev_russia_unification_war': 'img/events/ev_russia_unified.jpg',
      'ev_russia_unified_emergence': 'img/events/ev_russia_unified.jpg',
      'ev_russia_superpower': 'img/events/ev_russia_unified.jpg',
      'ev_russia_border_tension': 'img/events/ev_russia_reunification_threat.jpg',
      'ev_russia_reconciliation': 'img/events/ev_russia_unified.jpg',
      'ev_moscow_front_crisis': 'img/events/ev_west_russia_remnants.jpg',
      // 美国
      'ev_us_civil_unrest': 'img/events/ev_us_civil_unrest.jpg',
      'ev_us_civil_rights_1965': 'img/events/ev_us_civil_unrest.jpg',
      'ev_us_civil_rights_1963': 'img/events/ev_us_civil_unrest.jpg',
      'ev_us_presidential_election_1968': 'img/events/ev_us_civil_unrest.jpg',
      'ev_us_economic_recovery_1972': 'img/events/ev_us_civil_unrest.jpg',
      'ev_us_detente_1980': 'img/events/ev_ofn_diplomacy_1967.jpg',
      'ev_us_presidential_election_1988': 'img/events/ev_us_civil_unrest.jpg',
      'ev_us_race_riots': 'img/events/ev_us_civil_unrest.jpg',
      'ev_us_ofn_paralysis': 'img/events/ev_us_civil_unrest.jpg',
      'ev_us_recovery': 'img/events/ev_us_civil_unrest.jpg',
      'ev_us_civil_rights_legacy': 'img/events/ev_us_civil_unrest.jpg',
      'ev_us_new_era': 'img/events/ev_us_civil_unrest.jpg',
      'ev_ofn_intervention_africa_1976': 'img/events/ev_ofn_diplomacy_1967.jpg',
      // 日本
      'ev_japan_sphere_1968': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_japan_economic_collapse': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_japan_military_coup_1965': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_japan_economic_reform_1980': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_japan_democratization_1985': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_japan_economic_crisis': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_japan_navy_army_split': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_japan_yen_collapse': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_japan_reform': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_cps_manchuria_resistance': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_cps_korea_uprising': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_cps_china_inferno': 'img/events/ev_japan_sphere_1968.jpg',
      'ev_cps_decolonization': 'img/events/ev_japan_sphere_1968.jpg',
      // 意大利
      'ev_italy_triumvirate': 'img/events/ev_italy_triumvirate.jpg',
      'ev_italy_leaves_sphere': 'img/events/ev_italy_triumvirate.jpg',
      'ev_italy_leaves_german_sphere': 'img/events/ev_italy_triumvirate.jpg',
      'ev_italian_democracy_movement': 'img/events/ev_italy_triumvirate.jpg',
      'ev_italian_economic_crisis': 'img/events/ev_italy_triumvirate.jpg',
      'ev_italian_colonial_wars': 'img/events/ev_italy_triumvirate.jpg',
      'ev_italy_ciano': 'img/events/ev_italy_triumvirate.jpg',
      'ev_italy_democratization': 'img/events/ev_italy_triumvirate.jpg',
      'ev_italian_africa_collapse': 'img/events/ev_italy_triumvirate.jpg',
      'ev_triumvirate_formation': 'img/events/ev_italy_triumvirate.jpg',
      'ev_triumvirate_fracture': 'img/events/ev_italy_triumvirate.jpg',
      'ev_mediterranean_new_order': 'img/events/ev_italy_triumvirate.jpg',
      // 奴隶
      'ev_slave_question': 'img/events/ev_slave_question.jpg',
      'ev_slave_revolt_cycle': 'img/events/ev_slave_question.jpg',
      'ev_slave_rebellion_east': 'img/events/ev_slave_question.jpg',
      'ev_speer_slave_reform': 'img/events/ev_slave_question.jpg',
      'ev_german_economic_crisis_1985': 'img/events/ev_slave_question.jpg',
      // 改革/重建
      'ev_reconstruction_plan': 'img/events/ev_reconstruction_plan.jpg',
      'ev_speer_reforms_deep': 'img/events/ev_reconstruction_plan.jpg',
      'ev_reform_movement_1987': 'img/events/ev_reconstruction_plan.jpg',
      'ev_berlin_wall_equivalent': 'img/events/ev_reconstruction_plan.jpg',
      'ev_speer_economic_blueprint': 'img/events/ev_reconstruction_plan.jpg',
      'ev_speer_ofn_backchannel': 'img/events/ev_ofn_diplomacy_1967.jpg',
      'ev_speer_old_guard_resistance': 'img/events/ev_reconstruction_plan.jpg',
      'ev_speer_victory_consolidation': 'img/events/ev_reconstruction_plan.jpg',
      'ev_speer_student_guard': 'img/events/ev_student_protests_1962.jpg',
      'ev_bormann_stagnation': 'img/events/ev_reconstruction_plan.jpg',
      // 外交
      'ev_ofn_diplomacy_1967': 'img/events/ev_ofn_diplomacy_1967.jpg',
      'ev_rommel_mediation': 'img/events/ev_ofn_diplomacy_1967.jpg',
      'ev_neutral_zone_diplomats': 'img/events/ev_ofn_diplomacy_1967.jpg',
      'ev_neutral_zone_resolution': 'img/events/ev_ofn_diplomacy_1967.jpg',
      'ev_end_of_cold_war': 'img/events/ev_ofn_diplomacy_1967.jpg',
      'ev_new_world_order_1992': 'img/events/ev_ofn_diplomacy_1967.jpg',
      // 抗议/学生
      'ev_student_protests_1962': 'img/events/ev_student_protests_1962.jpg',
      'ev_student_movement_1968': 'img/events/ev_student_protests_1962.jpg',
      // 伊比利亚
      'ev_iberian_crisis': 'img/events/ev_iberian_crisis.jpg',
      'ev_iberian_collapse': 'img/events/ev_iberian_crisis.jpg',
      'ev_iberian_federation_strain': 'img/events/ev_iberian_crisis.jpg',
      'ev_iberia_strain': 'img/events/ev_iberian_crisis.jpg',
      'ev_spanish_civil_unrest': 'img/events/ev_iberian_crisis.jpg',
      // 法国
      'ev_french_resistance': 'img/events/ev_french_resistance.jpg',
      'ev_free_france_rallying': 'img/events/ev_french_resistance.jpg',
      'ev_degaulle_return': 'img/events/ev_french_resistance.jpg',
      'ev_bretagne_revolt': 'img/events/ev_french_resistance.jpg',
      'ev_british_resistance': 'img/events/ev_french_resistance.jpg',
      'ev_british_underground': 'img/events/ev_french_resistance.jpg',
      // 殖民地/去殖民
      'ev_decolonization_wave': 'img/events/ev_decolonization_wave.jpg',
      'ev_ukraine_independence': 'img/events/ev_decolonization_wave.jpg',
      'ev_ostland_collapse': 'img/events/ev_decolonization_wave.jpg',
      'ev_caucasus_uprising': 'img/events/ev_decolonization_wave.jpg',
      'ev_bohemia_annex': 'img/events/ev_decolonization_wave.jpg',
      'ev_danish_sovereignty': 'img/events/ev_decolonization_wave.jpg',
      'ev_norway_sovereignty': 'img/events/ev_decolonization_wave.jpg',
      'ev_dutch_annex': 'img/events/ev_decolonization_wave.jpg',
      'ev_colonial_revolts_summary': 'img/events/ev_decolonization_wave.jpg',
      'ev_indonesian_independence': 'img/events/ev_decolonization_wave.jpg',
      // 非洲
      'ev_north_africa_rising': 'img/events/ev_north_africa_rising.jpg',
      'ev_africa_scramble': 'img/events/ev_north_africa_rising.jpg',
      'ev_south_africa_crisis': 'img/events/ev_north_africa_rising.jpg',
      'ev_south_african_war': 'img/events/ev_north_africa_rising.jpg',
      'ev_first_nile_war': 'img/events/ev_north_africa_rising.jpg',
      'ev_saharan_war': 'img/events/ev_north_africa_rising.jpg',
      'ev_somali_ethiopian_war': 'img/events/ev_north_africa_rising.jpg',
      'ev_congo_dam_crisis': 'img/events/ev_north_africa_rising.jpg',
      'ev_anarchy_west_africa': 'img/events/ev_north_africa_rising.jpg',
      'ev_mediterranean_crisis': 'img/events/ev_north_africa_rising.jpg',
      'ev_suez_crisis': 'img/events/ev_oil_crisis_1975.jpg',
      // 石油/中东
      'ev_oil_crisis_1975': 'img/events/ev_oil_crisis_1975.jpg',
      'ev_oil_crisis_1979': 'img/events/ev_oil_crisis_1975.jpg',
      'ev_iranian_revolution': 'img/events/ev_oil_crisis_1975.jpg',
      'ev_lebanon_civil_war': 'img/events/ev_oil_crisis_1975.jpg',
      // 科技/互联网
      'ev_computer_revolution': 'img/events/ev_computer_revolution.jpg',
      'ev_internet_era': 'img/events/ev_internet_era.jpg',
      'ev_german_internet': 'img/events/ev_internet_era.jpg',
      'ev_personal_computer': 'img/events/ev_computer_revolution.jpg',
      'ev_technology_revolution_1995': 'img/events/ev_internet_era.jpg',
      'ev_information_age': 'img/events/ev_internet_era.jpg',
      // 环境
      'ev_environmental_crisis': 'img/events/ev_environmental_crisis.jpg',
      'ev_environmental_movement': 'img/events/ev_environmental_crisis.jpg',
      'ev_atlantropa_consequences': 'img/events/ev_environmental_crisis.jpg',
      'ev_atlantropa_aftermath': 'img/events/ev_environmental_crisis.jpg',
      'ev_gibraltar_dam_maintenance': 'img/events/ev_environmental_crisis.jpg',
      'ev_mediterranean_draining': 'img/events/ev_environmental_crisis.jpg',
      // 千禧年/终局
      'ev_millennium_anxiety': 'img/events/ev_millennium_anxiety.jpg',
      'ev_millennium_celebration': 'img/events/ev_millennium_anxiety.jpg',
      'ev_final_five_years': 'img/events/ev_millennium_anxiety.jpg',
      'ev_2000_finale': 'img/events/ev_millennium_anxiety.jpg',
    };
    if (realImages[ev.id]) return realImages[ev.id];

    // ===== 自动匹配与事件ID同名的图片（img/events/ev_id.jpg）=====
    if (id && !id.startsWith('ev_gen_')) return 'img/events/' + id + '.jpg';

    // ===== ev_gen_* 通用事件：按标题中的事件类型精准映射 =====
    // 标题格式为 "城市名：事件类型"，提取事件类型直接对应 ev_type_*.jpg
    if (id.startsWith('ev_gen_') && ev.title) {
      const titleTypeMap = {
        '马克贬值': 'ev_type_mark_devaluation',
        '美国民权运动': 'ev_type_civil_rights',
        '国葬': 'ev_type_state_funeral',
        '密码破译': 'ev_type_codebreaking',
        '神秘学活动': 'ev_type_occult',
        '外交危机': 'ev_type_diplomatic_crisis',
        '军火库爆炸': 'ev_type_arsenal_explosion',
        '黑市走私': 'ev_type_black_market',
        '航空展': 'ev_type_air_show',
        '奴隶起义': 'ev_type_slave_revolt',
        '人造卫星发射': 'ev_type_satellite_launch',
        '宗教冲突': 'ev_type_religious_conflict',
        '超自然现象调查': 'ev_type_paranormal',
        '艺术品掠夺': 'ev_type_art_looting',
        '宣传战': 'ev_type_propaganda',
        '火箭试射失败': 'ev_type_rocket_failure',
        '国防军哗变': 'ev_type_military_mutiny',
        '瘟疫爆发': 'ev_type_plague',
        '技术突破': 'ev_type_tech_breakthrough',
        '边境冲突': 'ev_type_border_clash',
        '高官叛逃': 'ev_type_defection',
        '太空竞赛突破': 'ev_type_space_race',
        '间谍案': 'ev_type_espionage',
        '集中营暴动': 'ev_type_camp_riot',
        '体育赛事': 'ev_type_sports',
        '罢工潮': 'ev_type_strike',
        '地下抵抗': 'ev_type_underground',
        '毒气泄漏': 'ev_type_gas_leak',
        '核设施事故': 'ev_type_nuclear_accident',
        '阅兵式': 'ev_type_military_parade',
        '粮食丰收': 'ev_type_harvest',
        '情报泄露': 'ev_type_intelligence_leak',
        '学生示威': 'ev_type_student_protest',
        '潜艇失踪': 'ev_type_submarine',
        '勃艮第渗透': 'ev_civil_war_burgundy',
        '俄罗斯军阀动态': 'ev_type_warlord',
        '经济危机': 'ev_type_economic_crisis',
        '党卫军异动': 'ev_type_ss_activity',
        '矿井坍塌': 'ev_type_mine_collapse',
        '核试验': 'ev_type_nuclear_test',
        '奴隶拍卖': 'ev_type_slave_auction',
        '气象异常': 'ev_type_weather_anomaly',
        'UFO目击': 'ev_type_ufo',
        '日本陆海对立': 'ev_type_navy_army_rivalry',
        '电影首映': 'ev_type_movie_premiere',
        '粮食短缺': 'ev_type_food_shortage',
        '外交婚礼': 'ev_type_diplomatic_wedding',
        '货币改革': 'ev_type_currency_reform',
        '暗杀阴谋': 'ev_type_assassination_plot',
        '工业事故': 'ev_type_industrial_accident',
      };
      for (const [suffix, imgId] of Object.entries(titleTypeMap)) {
        if (ev.title.includes(suffix)) return 'img/events/' + imgId + '.jpg';
      }
    }

    // 复用共享主题匹配逻辑
    const theme = this._matchEventTheme(ev);

    // 主题→真实历史图片映射（覆盖所有匹配该主题的事件，确保每个事件都有历史图片）
    const themeImages = {
      moon: 'img/events/ev_moon_landing.jpg',
      assassin: 'img/events/ev_hitler_assassinated.jpg',
      death: 'img/events/ev_hitler_death.jpg',
      succession: 'img/events/ev_succession_announcement.jpg',
      civilwar: 'img/events/ev_civil_war_battles.jpg',
      burgundy: 'img/events/ev_civil_war_burgundy.jpg',
      heydrich: 'img/events/ev_heydrich_ss.jpg',
      bormann: 'img/events/ev_bormann_stagnation.jpg',
      goring: 'img/events/ev_goring_war.jpg',
      speer: 'img/events/ev_speer_reforms.jpg',
      neutral_zone: 'img/events/ev_neutral_zone.jpg',
      atlantropa: 'img/events/ev_atlantropa.jpg',
      china: 'img/events/ev_china_occupation.jpg',
      korea: 'img/events/ev_korea.jpg',
      india: 'img/events/ev_india.jpg',
      indonesia: 'img/events/ev_indonesia.jpg',
      africa: 'img/events/ev_north_africa_rising.jpg',
      middle_east: 'img/events/ev_middle_east.jpg',
      iberia: 'img/events/ev_iberian_crisis.jpg',
      france: 'img/events/ev_french_resistance.jpg',
      britain: 'img/events/ev_french_resistance.jpg',
      turkey: 'img/events/ev_turkey.jpg',
      latin: 'img/events/ev_latin_america.jpg',
      technology: 'img/events/ev_internet_era.jpg',
      biotech: 'img/events/ev_biotech.jpg',
      environment: 'img/events/ev_environmental_crisis.jpg',
      plague: 'img/events/ev_plague.jpg',
      refugee: 'img/events/ev_refugee.jpg',
      demographics: 'img/events/ev_demographics.jpg',
      millennium: 'img/events/ev_millennium_anxiety.jpg',
      cold_war_finale: 'img/events/ev_cold_war_finale.jpg',
      military: 'img/events/ev_military_coup.jpg',
      oil: 'img/events/ev_oil_crisis_1975.jpg',
      russia: 'img/events/ev_russia_unified.jpg',
      america: 'img/events/ev_us_civil_unrest.jpg',
      japan: 'img/events/ev_japan_sphere_1968.jpg',
      italy: 'img/events/ev_italy_triumvirate.jpg',
      economy: 'img/events/ev_economic_miracle_1970.jpg',
      nuclear: 'img/events/ev_nuclear_arms_race.jpg',
      colony: 'img/events/ev_decolonization_wave.jpg',
      diplomacy: 'img/events/ev_ofn_diplomacy_1967.jpg',
      protest: 'img/events/ev_student_protests_1962.jpg',
      slave: 'img/events/ev_slave_question.jpg',
      reform: 'img/events/ev_reconstruction_plan.jpg',
      crime: 'img/events/ev_totalist_spread.jpg',
      death: 'img/events/ev_hitler_death.jpg',
    };
    if (themeImages[theme]) return themeImages[theme];

    // 默认真实图片（兜底，确保所有事件都返回真实图片而非SVG）
    return 'img/events/ev_millennium_anxiety.jpg';
  },

  // ===== SVG 占位图（用于真实图片加载前的秒开占位） =====
  _getEventSvgFallback(ev) {
    // 复用 _getEventImage 的主题匹配逻辑（跳过 realImages 表）
    return this._buildEventSvg(this._matchEventTheme(ev));
  },

  // ===== 主题匹配（共享逻辑，供 _getEventImage 和 _getEventSvgFallback 调用） =====
  _matchEventTheme(ev) {
    const text = ((ev.title || '') + ' ' + (ev.body || '')).toLowerCase();
    const id = (ev.id || '').toLowerCase();
    const rules = [
      { id: 'moon',     kw: ['登月','月球','火箭','宇航','冯·布劳恩','太空','星辰大海','火星','太空站','moon','rocket','mars','space'] },
      { id: 'assassin', kw: ['刺杀','刺客','遇刺','枪声','暗杀','贝格霍夫','达拉斯','assassin','枪击'] },
      { id: 'death',    kw: ['元首之死','希特勒之死','死讯','葬礼','悼念','死亡','阿道夫','恶魔之死'] },
      { id: 'succession', kw: ['继承','继位','继承人','接班','succession','successor','新元首','选择你的元首'] },
      { id: 'burgundy', kw: ['勃艮第','希姆莱','burgundy','himmler','黑骑士','骑士团','黑太阳','终末'] },
      { id: 'heydrich', kw: ['海德里希','heydrich','布拉格屠夫','党卫军国家','ss state','黑色王国'] },
      { id: 'bormann',  kw: ['鲍曼','bormann','党机器','黑袍','空荡的王座'] },
      { id: 'goring',   kw: ['戈林','goring','银鹰','空军','胖子的末日','铁血经济'] },
      { id: 'speer',    kw: ['施佩尔','speer','建筑师','四步改革','学生卫队','经济蓝图'] },
      { id: 'neutral_zone', kw: ['中立区','斯派达尔','speidal','隆美尔','rommel','霍费尔','hofer','克里米亚','黑海','海盗王'] },
      { id: 'atlantropa', kw: ['亚特兰特罗帕','atlantropa','直布罗陀大坝','干涸的海洋','地中海','排水','gibraltar'] },
      { id: 'china',    kw: ['中国','中原','满洲','溥仪','关东军','china','manchuria','manchukuo'] },
      { id: 'korea',    kw: ['朝鲜','韩国','korea','汉城','创氏改名'] },
      { id: 'india',    kw: ['印度','次大陆','india','恒河','德里'] },
      { id: 'indonesia', kw: ['印尼','印度尼西亚','爪哇','苏门答腊','万隆','indonesia','香料群岛'] },
      { id: 'africa',   kw: ['非洲','刚果','撒哈拉','尼罗河','南非','africa','congo','sahara','nile','好望角','非洲之角','无政府区'] },
      { id: 'middle_east', kw: ['波斯','伊朗','黎巴嫩','雪松','以色列','阿拉伯','iran','lebanon','suez','苏伊士','中东'] },
      { id: 'iberia',   kw: ['伊比利亚','西班牙','葡萄牙','弗朗哥','萨拉查','iberia','iberian','加泰罗尼亚'] },
      { id: 'france',   kw: ['法国','法兰西','戴高乐','自由法国','布列塔尼','france','french','degaulle'] },
      { id: 'britain',  kw: ['英国','不列颠','britain','british','英吉利','地下女王'] },
      { id: 'turkey',   kw: ['土耳其','安卡拉','凯末尔','turkey','turkish','博斯普鲁斯'] },
      { id: 'latin',    kw: ['南美','阿根廷','巴西','银之河','拉美','argentina','brazil','肮脏战争'] },
      { id: 'technology', kw: ['互联网','计算机','数据网','信息时代','数字革命','internet','computer','硅','个人电脑','科技'] },
      { id: 'biotech',  kw: ['基因','遗传','优生','生命之泉','genetic','biotech','上帝的剪刀'] },
      { id: 'environment', kw: ['环境','环保','污染','酸雨','生态','绿色','environment','自然灾害','燃烧的地球'] },
      { id: 'plague',   kw: ['瘟疫','流感','病毒','传染病','隔离','plague','pandemic','白色瘟疫'] },
      { id: 'refugee',  kw: ['难民','流民','庇护','逃亡','移民','refugee','巴尔干的流民'] },
      { id: 'demographics', kw: ['人口寒冬','人口危机','生育率','老龄化','人口结构','demographic'] },
      { id: 'millennium', kw: ['千禧','千年','2000','终章','结局','新千年','millennium'] },
      { id: 'cold_war_finale', kw: ['冷战终结','新世界秩序','解冻','cold war','world order','无核世界'] },
      { id: 'civilwar', kw: ['内战','战火','战役','交火','战线','巷战','civil war','国防军','党卫军','叛乱','兵变','兄弟相残'] },
      { id: 'russia',   kw: ['俄罗斯','苏联','红军','西俄','莫斯科','军阀','russia','soviet','siberia','西伯利亚','鄂木斯克','托木斯克','科米','萨马拉','乌拉尔','双头鹰'] },
      { id: 'america',  kw: ['美国','ofn','肯尼迪','华盛顿','美洲','america','usa','白宫','太平洋','合众国'] },
      { id: 'japan',    kw: ['日本','共荣圈','天皇','东京','japan','共荣','太平洋战争','珍珠港','日元'] },
      { id: 'italy',    kw: ['意大利','地中海','罗马','墨索里尼','italy','italian','齐亚诺','三头同盟'] },
      { id: 'economy',  kw: ['经济','工厂','马克','鲁尔','工业','失业','通胀','市场','economy','繁荣','泡沫','黑市'] },
      { id: 'nuclear',  kw: ['核','原子','蘑菇云','核弹','核武','nuclear','原子弹','核战争','熔毁'] },
      { id: 'oil',      kw: ['石油','oil','能源危机','黑金','opec'] },
      { id: 'colony',   kw: ['殖民地','独立','总督辖区','乌克兰专员','奥斯兰','高加索','叛乱','起义','colony','去殖民'] },
      { id: 'diplomacy', kw: ['外交','谈判','会议','协定','条约','访问','会晤','diplomacy','summit','斡旋','密使'] },
      { id: 'protest',  kw: ['抗议','学生','示威','游行','罢工','protest','riot','骚乱'] },
      { id: 'slave',    kw: ['奴隶','奴役','解放','slave','奴隶制','枷锁'] },
      { id: 'reform',   kw: ['改革','自由化','开放','reform','改革派','重建','蓝图'] },
      { id: 'military', kw: ['军队','军备','军事','国防','建军','military','军力','军靴','政变'] },
      // 新增：通用事件标题关键词匹配
      { id: 'technology', kw: ['航空展','工业事故','火箭试射','卫星发射','技术突破','广播','雷达','隧道','水坝','工厂','产业','工业','科技'] },
      { id: 'economy', kw: ['经济危机','经济崩溃','经济泡沫','金融危机','经济复苏','通胀','萧条','繁荣','黑市','经济'] },
      { id: 'nuclear', kw: ['核试验','核事故','核扩散','核威慑','核武器','熔毁','辐射','核'] },
      { id: 'environment', kw: ['污染','环境','生态','灾害','灾难','洪水','饥荒','干旱','环保','地震'] },
      { id: 'protest', kw: ['示威','抗议','罢工','骚乱','兵变','起义','叛乱','暴动','游行'] },
      { id: 'diplomacy', kw: ['峰会','外交','谈判','协定','条约','会议','会晤','访问','密使','斡旋'] },
      { id: 'crime', kw: ['丑闻','腐败','泄密','间谍','渗透','阴谋','暗杀','刺杀','走私','黑市'] },
      { id: 'death', kw: ['葬礼','国葬','死亡','逝世','遇难','牺牲','哀悼','纪念'] },
      { id: 'burgundy', kw: ['勃艮第渗透','勃艮第'] },
    ];
    for (const r of rules) {
      if (r.kw.some(k => text.includes(k) || id.includes(k))) return r.id;
    }
    return 'default';
  },

  // ===== 根据主题构建 SVG data URI =====
  _buildEventSvg(theme) {
    const svgs = this._eventSvgs || (this._eventSvgs = this._buildEventSvgLib());
    const raw = svgs[theme] || svgs.default;
    const svg = raw.replace(
      /(<rect width='480' height='180' fill='url\(#g\)'\/>)/,
      "$1<rect width='480' height='180' fill='#f0e8d8' opacity='0.12'/>"
    );
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg).replace(/'/g, '%27');
  },

  _buildEventSvgLib() {
    return {
      moon: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a1a2e'/><stop offset='1' stop-color='#0f0f1a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><circle cx='360' cy='60' r='28' fill='#a89868'/><circle cx='200' cy='15' r='1.5' fill='#e8c860'/><path d='M180 160 L200 100 L225 110 L240 160 Z' fill='#3a3a4a'/></svg>`,
      assassin: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a0a0a'/><stop offset='1' stop-color='#0a0505'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><ellipse cx='240' cy='120' rx='100' ry='40' fill='#8a2020' opacity='0.6'/><rect x='180' y='60' width='120' height='80' fill='#2a1a1a'/><circle cx='240' cy='100' r='12' fill='#5a2a2a'/></svg>`,
      death: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a1a1a'/><stop offset='1' stop-color='#0a0a0a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='220' y='80' width='40' height='80' fill='#0a0a0a'/><circle cx='240' cy='110' r='18' fill='#1a1a1a' stroke='#4a4a4a'/></svg>`,
      succession: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2014'/><stop offset='1' stop-color='#0f0a08'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='225' y='50' width='30' height='80' fill='#5a4a2a'/><circle cx='240' cy='35' r='8' fill='#c93232'/></svg>`,
      civilwar: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3a2a1a'/><stop offset='1' stop-color='#1a0a05'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><ellipse cx='240' cy='165' rx='100' ry='30' fill='#e85a20' opacity='0.6'/><rect x='60' y='80' width='30' height='80' fill='#1a1a1a'/><rect x='350' y='85' width='28' height='75' fill='#1a1a1a'/></svg>`,
      burgundy: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a0a1a'/><stop offset='1' stop-color='#050208'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M180 160 L180 80 L200 60 L280 60 L300 80 L300 160 Z' fill='#0a0508'/><rect x='225' y='100' width='30' height='60' fill='#000'/></svg>`,
      heydrich: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#0a0a14'/><stop offset='1' stop-color='#000005'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M180 160 L180 70 L200 50 L280 50 L300 70 L300 160 Z' fill='#1a1a1a'/><circle cx='240' cy='95' r='8' fill='none' stroke='#c9a84a' opacity='0.6'/></svg>`,
      bormann: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2418'/><stop offset='1' stop-color='#0a0805'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M120 160 L120 80 L240 50 L360 80 L360 160 Z' fill='#1a1a1a'/><circle cx='240' cy='90' r='6' fill='#c9a84a' opacity='0.5'/></svg>`,
      goring: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3a3a4a'/><stop offset='1' stop-color='#1a1a2a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M80 90 L100 70 L120 90 Z' fill='#5a5a5a'/><path d='M280 90 L300 70 L320 90 Z' fill='#5a5a5a'/><path d='M0 130 Q240 120 480 120 L480 180 L0 180 Z' fill='#1a1a1a'/></svg>`,
      speer: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2a3a'/><stop offset='1' stop-color='#0f0f1a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M80 160 L80 80 Q80 50 140 50 Q200 50 200 80 L200 160 Z' fill='#3a3a4a'/><path d='M280 160 L280 80 Q280 50 340 50 Q400 50 400 80 L400 160 Z' fill='#3a3a4a'/></svg>`,
      neutral_zone: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3a4a3a'/><stop offset='1' stop-color='#1a2a1a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='80' y='90' width='40' height='40' fill='#2a3a2a'/><rect x='360' y='95' width='35' height='35' fill='#2a3a2a'/><path d='M0 120 Q240 110 480 115 L480 130 L0 130 Z' fill='#5a6a5a' opacity='0.5'/></svg>`,
      atlantropa: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#5a4a3a'/><stop offset='0.5' stop-color='#3a3a4a'/><stop offset='1' stop-color='#1a2a3a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M0 95 L480 95 L480 110 L0 110 Z' fill='#2a2a3a'/><rect x='180' y='60' width='120' height='35' fill='#5a5a6a' opacity='0.8'/></svg>`,
      china: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#4a2a1a'/><stop offset='1' stop-color='#1a0a08'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><circle cx='100' cy='50' r='25' fill='#8a2a2a' opacity='0.8'/><path d='M150 160 L150 90 L210 90 L210 160 Z' fill='#3a2a1a'/><rect x='250' y='100' width='80' height='60' fill='#2a2a2a'/></svg>`,
      korea: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a3a4a'/><stop offset='1' stop-color='#0a1a2a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><circle cx='240' cy='90' r='15' fill='none' stroke='#c9a84a' stroke-width='2' opacity='0.7'/><path d='M225 90 L255 90 M240 75 L240 105' stroke='#c9a84a' opacity='0.7'/></svg>`,
      india: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#4a3a2a'/><stop offset='1' stop-color='#1a1408'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><circle cx='240' cy='55' r='22' fill='#e88030' opacity='0.8'/><path d='M180 160 L180 100 L300 100 L300 160 Z' fill='#3a2a1a'/></svg>`,
      indonesia: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a3a4a'/><stop offset='1' stop-color='#0a1a2a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M60 100 Q240 90 420 95 L420 110 L60 110 Z' fill='#3a5a4a' opacity='0.7'/><circle cx='240' cy='60' r='18' fill='#8a6a3a' opacity='0.6'/></svg>`,
      africa: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3a4a5a'/><stop offset='1' stop-color='#2a1a0a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><circle cx='100' cy='40' r='20' fill='#e8a030' opacity='0.8'/><path d='M0 130 Q240 115 480 120 L480 180 L0 180 Z' fill='#8a6a3a' opacity='0.8'/></svg>`,
      middle_east: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#4a3a1a'/><stop offset='1' stop-color='#1a1408'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><circle cx='400' cy='40' r='18' fill='#e88030' opacity='0.8'/><path d='M150 160 L150 80 Q240 60 330 80 L330 160 Z' fill='#3a2a1a'/></svg>`,
      iberia: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3a2a1a'/><stop offset='1' stop-color='#1a0f08'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='100' y='70' width='40' height='50' fill='#8a2a2a' opacity='0.7'/><path d='M0 100 Q240 90 480 90 L480 130 L0 130 Z' fill='#5a3a1a' opacity='0.8'/></svg>`,
      france: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2a3a'/><stop offset='1' stop-color='#0a0a1a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M180 160 L180 60 L300 60 L300 160 Z' fill='#3a3a4a'/><rect x='210' y='80' width='60' height='80' fill='#1a1a2a'/></svg>`,
      britain: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a3a4a'/><stop offset='1' stop-color='#0a1a2a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M0 100 Q240 85 480 95 L480 110 L0 110 Z' fill='#5a5a5a' opacity='0.7'/><path d='M180 160 L180 70 L300 70 L300 160 Z' fill='#3a4a5a'/></svg>`,
      turkey: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a3a4a'/><stop offset='1' stop-color='#0a1a2a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><circle cx='380' cy='50' r='18' fill='#e8e0c0'/><circle cx='372' cy='50' r='15' fill='#0a1a2a'/><path d='M100 160 L100 80 L180 80 L180 160 Z' fill='#3a4a5a'/></svg>`,
      latin: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3a4a3a'/><stop offset='1' stop-color='#1a2a1a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><circle cx='80' cy='45' r='22' fill='#e88030' opacity='0.8'/><path d='M0 130 Q240 100 480 105 L480 180 L0 180 Z' fill='#2a3a2a' opacity='0.8'/></svg>`,
      technology: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#0a1a2a'/><stop offset='1' stop-color='#050810'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><g stroke='#3a8a4a' stroke-width='0.5' opacity='0.4' fill='none'><path d='M20 40 L460 40 M20 80 L460 80 M20 120 L460 120'/></g><rect x='180' y='70' width='120' height='80' fill='#1a2a1a' stroke='#3a8a4a'/></svg>`,
      biotech: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a2a1a'/><stop offset='1' stop-color='#0a140a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M100 160 Q140 90 180 130 Q220 160 260 100 Q300 60 340 120 Q380 160 420 100' fill='none' stroke='#6a8a4a' stroke-width='1' opacity='0.7'/><circle cx='140' cy='90' r='5' fill='#8aaa5a'/><circle cx='260' cy='100' r='5' fill='#8aaa5a'/></svg>`,
      environment: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#4a3a2a'/><stop offset='1' stop-color='#2a1a0a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M0 130 Q240 115 480 120 L480 180 L0 180 Z' fill='#3a2a1a' opacity='0.8'/><ellipse cx='240' cy='135' rx='50' ry='8' fill='#8a3a2a' opacity='0.6'/></svg>`,
      plague: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2a2a'/><stop offset='1' stop-color='#0a0a0a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M180 160 L180 80 L300 80 L300 160 Z' fill='#5a5a5a'/><rect x='220' y='90' width='40' height='70' fill='#8a8a8a' opacity='0.6'/></svg>`,
      refugee: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3a3a2a'/><stop offset='1' stop-color='#1a1a0a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='80' y='80' width='25' height='50' fill='#2a2a2a'/><rect x='340' y='80' width='25' height='50' fill='#2a2a2a'/><path d='M0 130 Q240 120 480 120 L480 180 L0 180 Z' fill='#5a5a5a' opacity='0.7'/></svg>`,
      demographics: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2a3a'/><stop offset='1' stop-color='#0a0a1a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='60' y='50' width='20' height='100' fill='#5a5a6a'/><rect x='120' y='80' width='20' height='70' fill='#5a5a6a'/><rect x='180' y='110' width='20' height='40' fill='#5a5a6a'/><rect x='340' y='70' width='20' height='80' fill='#8a6a3a'/><rect x='370' y='55' width='20' height='95' fill='#8a6a3a'/></svg>`,
      millennium: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a1a3a'/><stop offset='1' stop-color='#0a0a1a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><ellipse cx='240' cy='160' rx='180' ry='40' fill='#e8a030' opacity='0.6'/><circle cx='240' cy='25' r='3' fill='#e8c860'/></svg>`,
      cold_war_finale: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a4a3a'/><stop offset='1' stop-color='#0a1a1a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><ellipse cx='240' cy='130' rx='200' ry='50' fill='#e8c860' opacity='0.3'/><path d='M0 130 Q240 115 480 115 L480 180 L0 180 Z' fill='#3a4a3a' opacity='0.7'/></svg>`,
      oil: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a1a0a'/><stop offset='1' stop-color='#0a0505'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='180' y='70' width='120' height='80' fill='#3a3a2a'/><path d='M240 100 L240 30' stroke='#8a6a3a' stroke-width='2' opacity='0.7'/></svg>`,
      russia: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#4a5a6a'/><stop offset='1' stop-color='#1a2a3a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M0 140 Q240 110 480 115 L480 180 L0 180 Z' fill='#e8e8e8'/><circle cx='240' cy='80' r='15' fill='#8a2a2a' opacity='0.7'/></svg>`,
      america: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a2a4a'/><stop offset='1' stop-color='#0a1a2a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='0' y='0' width='120' height='45' fill='#3a5a8a' opacity='0.6'/><rect x='0' y='90' width='240' height='90' fill='#3a5a8a' opacity='0.3'/></svg>`,
      japan: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#4a3a1a'/><stop offset='1' stop-color='#1a1408'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><circle cx='240' cy='60' r='30' fill='#e84030'/><rect x='180' y='110' width='120' height='50' fill='#8a2a2a' opacity='0.8'/></svg>`,
      italy: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2a1a'/><stop offset='1' stop-color='#0f0f08'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='120' y='40' width='20' height='120' fill='#5a4a2a'/><rect x='340' y='40' width='20' height='120' fill='#5a4a2a'/><path d='M200 160 L200 80 Q240 60 280 80 L280 160 Z' fill='#6a5a3a'/></svg>`,
      economy: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3a3a2a'/><stop offset='1' stop-color='#1a1a0a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='40' y='80' width='40' height='80' fill='#1a1a1a'/><rect x='90' y='60' width='50' height='100' fill='#1a1a1a'/><rect x='355' y='55' width='55' height='105' fill='#1a1a1a'/></svg>`,
      nuclear: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a1a0a'/><stop offset='1' stop-color='#0a0a05'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><ellipse cx='240' cy='90' rx='70' ry='60' fill='#e8c860'/><ellipse cx='240' cy='100' rx='50' ry='25' fill='#e8a830' opacity='0.6'/></svg>`,
      colony: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#3a2a1a'/><stop offset='1' stop-color='#1a0f08'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M0 140 Q240 120 480 125 L480 180 L0 180 Z' fill='#5a4a3a'/><ellipse cx='240' cy='160' rx='60' ry='25' fill='#e85a20' opacity='0.6'/></svg>`,
      diplomacy: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2a3a'/><stop offset='1' stop-color='#0f0f1a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='80' y='40' width='40' height='120' fill='#3a3a4a'/><rect x='360' y='40' width='40' height='120' fill='#3a3a4a'/><rect x='210' y='65' width='60' height='50' fill='#2a2a3a' stroke='#5a5a6a'/></svg>`,
      protest: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2a2a'/><stop offset='1' stop-color='#0a0a0a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='30' y='100' width='30' height='60' fill='#1a1a1a'/><rect x='80' y='95' width='35' height='65' fill='#1a1a1a'/><rect x='270' y='98' width='30' height='62' fill='#1a1a1a'/></svg>`,
      slave: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a1a14'/><stop offset='1' stop-color='#0f0808'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><circle cx='240' cy='90' r='25' fill='#4a3a2a' opacity='0.6'/><line x1='70' y1='60' x2='110' y2='60' stroke='#3a3a3a' stroke-width='2'/></svg>`,
      reform: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a2a1a'/><stop offset='1' stop-color='#0a140a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><ellipse cx='240' cy='60' rx='120' ry='50' fill='#e8e0a0' opacity='0.3'/><path d='M230 160 L240 130 L250 160 Z' fill='#6a8a4a' opacity='0.5'/></svg>`,
      military: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2a2a'/><stop offset='1' stop-color='#0a0a0a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><path d='M100 160 L100 100 L120 160 Z' fill='#1a1a1a'/><circle cx='110' cy='85' r='12' fill='#2a2a2a'/><path d='M260 160 L260 100 L280 160 Z' fill='#1a1a1a'/></svg>`,
      crime: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#1a0a0a'/><stop offset='1' stop-color='#050505'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><circle cx='240' cy='90' r='30' fill='#2a1a1a'/><path d='M230 80 L250 80 L255 95 L240 110 L225 95 Z' fill='#5a2a2a' opacity='0.7'/></svg>`,
      death: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2a2a'/><stop offset='1' stop-color='#0a0a0a'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><rect x='220' y='60' width='40' height='100' fill='#1a1a1a'/><ellipse cx='240' cy='75' rx='25' ry='10' fill='#3a3a3a' opacity='0.5'/></svg>`,
      default: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 180'><defs><linearGradient id='g' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='#2a2014'/><stop offset='1' stop-color='#0a0808'/></linearGradient></defs><rect width='480' height='180' fill='url(#g)'/><ellipse cx='240' cy='90' rx='80' ry='50' fill='#c9a84a' opacity='0.2'/><circle cx='240' cy='75' r='15' fill='#3a2a1a'/></svg>`,
    };
  },

  showEventModal(ev) {
    const s = Game.state;
    const tagText = { critical: '关键事件', major: '重大事件', minor: '一般事件' };
    const modal = document.getElementById('event-modal');
    const dateStr = Game.getDateStr();

    // 检查所有选项可用性，若全禁用则启用第一个作为兜底
    const results = ev.choices.map((c) => Game.canChooseEventOption(ev, c));
    const allDisabled = results.every((ok) => !ok);
    if (allDisabled && ev.choices.length > 0) {
      results[0] = true;
    }

    const choicesHtml = ev.choices.map((c, i) => {
      const canChoose = results[i];
      const cls = canChoose ? '' : 'disabled';
      const effectsHtml = c.effects ? this.renderEffectsPreview(c.effects) : '';
      return `
        <button class="choice-btn ${cls}" data-choice="${i}" ${canChoose ? '' : 'disabled'}>
          <div class="choice-title">${c.text}</div>
          <div class="choice-desc">${c.desc || ''}</div>
          ${effectsHtml}
        </button>`;
    }).join('');

    const imgSrc = this._getEventImage(ev);
    const svgFallback = this._getEventSvgFallback(ev);

    modal.innerHTML = `
      <div class="modal-box">
        <div class="event-image-banner-wrap">
          <img class="event-image-banner" src="${imgSrc}" alt="历史图片"
               onerror="this.onerror=null;this.src='${svgFallback}';" />
        </div>
        <div class="modal-header">
          <div class="m-date">${dateStr}</div>
          <div class="m-title">${ev.title}</div>
          <span class="m-tag ${ev.tag || 'minor'}">${tagText[ev.tag] || '事件'}</span>
        </div>
        <div class="modal-body">${ev.body}</div>
        <div class="modal-choices">${choicesHtml}</div>
      </div>
    `;
    modal.classList.add('active');

    // 绑定选项
    modal.querySelectorAll('[data-choice]').forEach(btn => {
      btn.onclick = () => {
        if (btn.disabled) return;
        const idx = parseInt(btn.dataset.choice);
        const choice = ev.choices[idx];
        Game.chooseEventOption(ev, choice);
        if (choice.showToast) this.toast(choice.showToast, 'info');

        modal.classList.remove('active');
        this.currentEventIndex++;

        // 立即刷新顶栏资源数值（不等待所有事件处理完）
        this.renderTopbar();

        // 检查是否触发结局（如核毁灭）
        if (Game.state.ended) {
          this.showEnding();
          return;
        }

        // 显示下一个事件
        setTimeout(() => this.showNextEvent(), 200);
      };
    });
  },

  renderEffectsPreview(effects) {
    const labels = {
      money: '资金', manpower: '人力', stability: '稳定', deterrence: '威慑',
      militaryPower: '军力', nukeDeter: '核慑', nukes: '核弹', research: '研发',
      ofn_relation: '美国', japan_relation: '日本', italy_relation: '意大利',
      burgundy_relation: '勃艮第', russia_relation: '俄罗斯'
    };
    const parts = Object.entries(effects).map(([k, v]) => {
      const sign = v > 0 ? '+' : '';
      const cls = v > 0 ? 'pos' : 'neg';
      return `<span class="eff ${cls}">${labels[k] || k} ${sign}${v}</span>`;
    }).join('');
    return parts ? `<div style="margin-top:6px;font-size:11px;">${parts}</div>` : '';
  },

  // ===== 结局画面 =====
  showEnding() {
    const s = Game.state;
    const ending = ENDINGS[s.endingId] || ENDINGS.collapse;
    const r = s.resources;

    const screen = document.getElementById('ending-screen');
    screen.innerHTML = `
      <div class="ending-tag">${ending.tag} · ${s.year}年 · ${DIFFICULTIES[s.difficulty]?.name || '普通'}难度</div>
      <div class="ending-title">${ending.title}</div>
      <div class="ending-stats">
        <div class="ending-stat"><div class="es-val">${s.turn}</div><div class="es-label">历经回合</div></div>
        <div class="ending-stat"><div class="es-val">${Math.round(r.stability)}</div><div class="es-label">最终稳定度</div></div>
        <div class="ending-stat"><div class="es-val">${Math.round(r.deterrence)}</div><div class="es-label">最终威慑</div></div>
        <div class="ending-stat"><div class="es-val">${Math.round(r.nukes)}</div><div class="es-label">核武器</div></div>
        <div class="ending-stat"><div class="es-val">${SUCCESSION_PATHS[s.chosenPath]?.title || '无'}</div><div class="es-label">路线</div></div>
      </div>
      <div class="ending-text">${ending.text}</div>
      <button class="btn-restart" onclick="location.reload()">重启帝国 ▸</button>
    `;
    screen.classList.add('active');
    document.getElementById('game').classList.remove('active');
  },

  // ===== Toast 通知 =====
  toast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  },

  // ===== DEBUG 模式 =====
  isDebugMode() {
    try { return sessionStorage.getItem('tno_debug') === '1'; } catch(e) { return false; }
  },

  toggleDebugPanel() {
    let panel = document.getElementById('debug-panel');
    if (panel) {
      panel.remove();
      return;
    }
    panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:var(--bg-panel);border:1px solid var(--accent-gold);border-radius:8px;padding:16px;z-index:9999;width:320px;max-height:80vh;overflow-y:auto;box-shadow:0 8px 32px rgba(0,0,0,0.6);';
    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <strong style="color:var(--accent-gold);">DEBUG 控制台</strong>
        <span id="dbg-close" style="cursor:pointer;color:var(--text-muted);">✕</span>
      </div>
      <div style="display:grid;gap:8px;">
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:4px;">资源调整</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button class="dbg-btn" data-act="money100">+100 资金</button>
          <button class="dbg-btn" data-act="money500">+500 资金</button>
          <button class="dbg-btn" data-act="mp50">+50 人力</button>
          <button class="dbg-btn" data-act="mp200">+200 人力</button>
          <button class="dbg-btn" data-act="stab20">+20 稳定</button>
          <button class="dbg-btn" data-act="det20">+20 威慑</button>
          <button class="dbg-btn" data-act="mil30">+30 军力</button>
          <button class="dbg-btn" data-act="nuk20">+20 核慑</button>
          <button class="dbg-btn" data-act="res20">+20 研发</button>
          <button class="dbg-btn" data-act="nuke5">+5 核弹</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">时间控制</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button class="dbg-btn" data-act="skip4">跳4回合</button>
          <button class="dbg-btn" data-act="skip16">跳16回合</button>
          <button class="dbg-btn" data-act="goto1980">跳到1980</button>
          <button class="dbg-btn" data-act="goto2000">跳到2000</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">国策 / 科技</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button class="dbg-btn" data-act="focus">秒完当前国策</button>
          <button class="dbg-btn" data-act="allfocus">完成所有国策</button>
          <button class="dbg-btn" data-act="techs">解锁所有科技</button>
          <button class="dbg-btn" data-act="flags">解锁所有标记</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">其他</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
          <button class="dbg-btn" data-act="relation">关系全+50</button>
          <button class="dbg-btn" data-act="russia">俄罗斯立即统一</button>
          <button class="dbg-btn" data-act="maxall">资源全满</button>
          <button class="dbg-btn" data-act="reset">资源清零</button>
        </div>
        <div style="font-size:11px;color:var(--text-muted);margin:8px 0 4px;">查看状态</div>
        <button class="dbg-btn" data-act="dump">输出状态到控制台</button>
      </div>
    `;
    document.body.appendChild(panel);
    panel.querySelector('#dbg-close').onclick = () => panel.remove();
    panel.querySelectorAll('.dbg-btn').forEach(btn => {
      btn.style.cssText = 'background:var(--bg-dark);border:1px solid var(--border);color:var(--text);padding:6px 8px;border-radius:4px;font-size:12px;cursor:pointer;';
      btn.onclick = () => this.debugAction(btn.dataset.act);
    });
  },

  debugAction(act) {
    const s = Game.state;
    const r = s.resources;
    switch(act) {
      case 'money100': r.money += 100; this.toast('+100 资金', 'success'); break;
      case 'money500': r.money += 500; this.toast('+500 资金', 'success'); break;
      case 'mp50': r.manpower += 50; this.toast('+50 人力', 'success'); break;
      case 'mp200': r.manpower += 200; this.toast('+200 人力', 'success'); break;
      case 'stab20': r.stability = Math.min(100, r.stability + 20); this.toast('+20 稳定', 'success'); break;
      case 'det20': r.deterrence += 20; this.toast('+20 威慑', 'success'); break;
      case 'mil30': r.militaryPower += 30; this.toast('+30 军力', 'success'); break;
      case 'nuk20': r.nukeDeter += 20; this.toast('+20 核慑', 'success'); break;
      case 'res20': r.research += 20; this.toast('+20 研发', 'success'); break;
      case 'nuke5': r.nukes += 5; this.toast('+5 核弹', 'success'); break;
      case 'skip4':
        for (let i = 0; i < 4 && !s.ended; i++) { Game.advanceTurn([], () => {}); }
        this.toast('跳过4回合', 'success'); break;
      case 'skip16':
        for (let i = 0; i < 16 && !s.ended; i++) { Game.advanceTurn([], () => {}); }
        this.toast('跳过16回合', 'success'); break;
      case 'goto1980':
        while (s.year < 1980 && !s.ended) { Game.advanceTurn([], () => {}); }
        this.toast(`跳到 ${s.year}Q${s.quarter}`, 'success'); break;
      case 'goto2000':
        while (s.year < 2000 && !s.ended) { Game.advanceTurn([], () => {}); }
        this.toast(`跳到 ${s.year}Q${s.quarter}`, 'success'); break;
      case 'focus':
        if (s.currentFocus) {
          const f = NATIONAL_FOCI[s.currentFocus];
          if (f) {
            s.completedFoci.push(s.currentFocus);
            if (f.setFlags) { for (const k in f.setFlags) s.flags[k] = f.setFlags[k]; }
            if (f.effects) { for (const k in f.effects) {
              if (k.includes('_relation')) { s.relations[k] = (s.relations[k]||0) + f.effects[k]; }
              else { r[k] = (r[k]||0) + f.effects[k]; }
            }}
            s.currentFocus = null; s.focusProgress = 0;
            this.toast(`国策完成: ${f.name}`, 'success');
          }
        } else { this.toast('当前无执行中国策', 'error'); }
        break;
      case 'allfocus':
        for (const fid in NATIONAL_FOCI) {
          if (!s.completedFoci.includes(fid)) {
            s.completedFoci.push(fid);
            const f = NATIONAL_FOCI[fid];
            if (f.setFlags) { for (const k in f.setFlags) s.flags[k] = f.setFlags[k]; }
          }
        }
        s.currentFocus = null; s.focusProgress = 0;
        s.flags.economic_reform_1 = true;
        s.flags.slave_reform_1 = true;
        s.flags.political_reform_1 = true;
        s.flags.nuclear_tech = true;
        s.flags.advanced_tech = true;
        s.flags.burgundian_threat = true;
        this.toast('所有国策已完成', 'success'); break;
      case 'techs':
        for (const tid in (typeof TECHS !== 'undefined' ? TECHS : {})) {
          s.techs[tid] = true; s.flags[tid] = true;
        }
        this.toast('所有科技已解锁', 'success'); break;
      case 'flags':
        s.flags.economic_reform_1 = true;
        s.flags.slave_reform_1 = true;
        s.flags.political_reform_1 = true;
        s.flags.nuclear_tech = true;
        s.flags.advanced_tech = true;
        s.flags.burgundian_threat = true;
        s.flags.rocketry_done = true;
        s.flags.burgundy_betrayed = false;
        this.toast('关键标记已解锁', 'success'); break;
      case 'relation':
        for (const k in s.relations) { s.relations[k] = Math.min(100, (s.relations[k]||0) + 50); }
        this.toast('所有关系+50', 'success'); break;
      case 'russia':
        s.russiaState = 'unified';
        s.flags.russia_unified = true;
        s.flags.russia_democratic = true;
        this.toast('俄罗斯已统一（民主派）', 'success'); break;
      case 'maxall':
        r.money = 9999; r.manpower = 9999; r.stability = 100; r.deterrence = 999;
        r.militaryPower = 999; r.nukeDeter = 999; r.research = 999; r.nukes = 99;
        this.toast('资源全满', 'success'); break;
      case 'reset':
        r.money = 200; r.manpower = 30; r.stability = 45; r.deterrence = 60;
        r.militaryPower = 80; r.nukeDeter = 30; r.research = 20; r.nukes = 2;
        this.toast('资源已重置', 'success'); break;
      case 'dump':
        console.log('===== GAME STATE DUMP =====');
        console.log(JSON.parse(JSON.stringify(s)));
        console.log('===== END DUMP =====');
        this.toast('状态已输出到控制台(F12)', 'success'); break;
    }
    Game.clampResources();
    this.requestRender();
    this.autoSave();
  },

  // ===== 保存游戏 (默认槽位1) =====
  saveGame() {
    if (typeof SaveSystem === 'undefined') {
      this.toast('存档系统未加载', 'error');
      return;
    }
    const result = SaveSystem.saveToSlot(1);
    this.toast(result.msg, result.ok ? 'success' : 'error');
  },

  // ===== 自动保存 (静默, 槽位0) =====
  autoSave() {
    if (typeof SaveSystem !== 'undefined') {
      SaveSystem.autoSave();
    }
  },

  // ===== 加载游戏 (优先槽位1, 回退自动存档) =====
  loadGame() {
    if (typeof SaveSystem === 'undefined') return false;
    // 迁移旧存档
    SaveSystem.migrateLegacy();
    // 优先加载槽位1
    let result = SaveSystem.loadFromSlot(1);
    if (!result.ok) {
      // 回退到自动存档
      result = SaveSystem.loadFromSlot(0);
    }
    if (result.ok) {
      this.toast(result.msg, 'success');
      return true;
    } else {
      console.log('无可用存档:', result.msg);
      return false;
    }
  },

  // ===== 存档管理面板 =====
  showSavePanel(mode) {
    // mode: 'save' | 'load'
    if (typeof SaveSystem === 'undefined') {
      this.toast('存档系统未加载', 'error');
      return;
    }
    const slots = SaveSystem.getAllSlots();
    const diffNames = { easy: '简单', normal: '普通', hard: '困难', hell: '地狱' };
    const pathNames = {
      reform: '改革派', militarist: '军部路线', conservative: '保守派',
      reform_democrat: '民主改革', militarist_extreme: '极端军部'
    };

    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    const panel = document.createElement('div');
    panel.style.cssText = 'background:var(--bg-panel);border:1px solid var(--border);border-radius:8px;padding:20px;max-width:500px;width:100%;max-height:80vh;overflow-y:auto;';
    panel.onclick = (e) => e.stopPropagation();

    panel.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid var(--border);padding-bottom:10px;">
        <h2 style="font-family:var(--font-serif);color:var(--accent-gold-bright);margin:0;letter-spacing:0.05em;">${mode === 'save' ? '保存进度' : '读取存档'}</h2>
        <button class="btn-secondary" id="save-close" style="padding:4px 10px;">关闭</button>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${slots.map(slot => {
          const m = slot.meta;
          const isAuto = slot.type === 'auto';
          const occupied = slot.occupied;
          let infoHtml = '';
          if (occupied && m) {
            const date = new Date(m.savedAt).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
            const path = m.chosenPath ? (pathNames[m.chosenPath] || m.chosenPath) : '未定';
            infoHtml = `
              <div style="font-size:11px;color:var(--text-primary);margin-top:4px;">
                ${m.year}年Q${m.quarter} · ${diffNames[m.difficulty] || m.difficulty} · ${m.leader}
              </div>
              <div style="font-size:10px;color:var(--text-muted);">
                路线: ${path} · 稳定: ${m.stability} · ${date}
              </div>`;
          } else {
            infoHtml = '<div style="font-size:11px;color:var(--text-muted);margin-top:4px;">空槽位</div>';
          }
          return `
            <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:6px;padding:10px;${isAuto ? 'opacity:0.85;' : ''}">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="flex:1;">
                  <span style="font-size:13px;color:${isAuto ? 'var(--accent-gold)' : 'var(--text-primary)'};font-weight:bold;">
                    ${isAuto ? '🔄 ' : '💾 '}${slot.name}
                  </span>
                  ${infoHtml}
                </div>
                <div style="display:flex;gap:4px;">
                  ${mode === 'save'
                    ? (isAuto
                      ? `<button class="btn btn-build" data-load-slot="${slot.id}" style="padding:4px 10px;font-size:11px;">读取</button>`
                      : occupied
                        ? `<button class="btn" data-load-slot="${slot.id}" style="padding:4px 10px;font-size:11px;background:var(--accent-blue);color:#fff;border:1px solid var(--accent-blue);">读取</button><button class="btn btn-build" data-save-slot="${slot.id}" style="padding:4px 10px;font-size:11px;">覆盖</button>`
                        : `<button class="btn btn-build" data-save-slot="${slot.id}" style="padding:4px 10px;font-size:11px;">保存</button>`)
                    : (occupied
                      ? `<button class="btn" data-load-slot="${slot.id}" style="padding:4px 10px;font-size:11px;background:var(--accent-blue);color:#fff;border:1px solid var(--accent-blue);">读取</button>${!isAuto ? `<button class="btn-secondary" data-del-slot="${slot.id}" style="padding:4px 8px;font-size:10px;margin-left:2px;">删除</button>` : ''}`
                      : '<span style="font-size:10px;color:var(--text-muted);padding:4px 8px;">空</span>')
                  }
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
      <div style="font-size:10px;color:var(--text-muted);margin-top:12px;text-align:center;border-top:1px solid var(--border);padding-top:8px;">
        存档包含: 年份 · 国家数据 · 科技 · 工业 · 外交 · 事件进度 · AI战略
      </div>
    `;
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // 绑定事件
    panel.querySelector('#save-close').onclick = () => overlay.remove();
    panel.querySelectorAll('[data-save-slot]').forEach(btn => {
      btn.onclick = () => {
        const slotId = +btn.dataset.saveSlot;
        const result = SaveSystem.saveToSlot(slotId);
        this.toast(result.msg, result.ok ? 'success' : 'error');
        if (result.ok) {
          overlay.remove();
          this.requestRender();
        }
      };
    });
    panel.querySelectorAll('[data-load-slot]').forEach(btn => {
      btn.onclick = () => {
        const slotId = +btn.dataset.loadSlot;
        const result = SaveSystem.loadFromSlot(slotId);
        this.toast(result.msg, result.ok ? 'success' : 'error');
        if (result.ok) {
          overlay.remove();
          // 如果在开始页面（splash 可见），则切换到游戏界面
          const splash = document.getElementById('splash');
          const game = document.getElementById('game');
          if (splash && splash.style.display !== 'none') {
            splash.style.display = 'none';
            if (game) game.classList.add('active');
          }
          this.requestRender();
          // 如果有预加载事件图片，也加载一下
          if (typeof this.preloadEventImages === 'function') {
            try { this.preloadEventImages(); } catch(_) {}
          }
        }
      };
    });
    panel.querySelectorAll('[data-del-slot]').forEach(btn => {
      btn.onclick = () => {
        const slotId = +btn.dataset.delSlot;
        const result = SaveSystem.deleteSlot(slotId);
        this.toast(result.msg, 'success');
        overlay.remove();
        this.showSavePanel(mode); // 刷新面板
      };
    });
  }
};

// 导出
if (typeof window !== 'undefined') {
  window.UI = UI;
  window.ENDINGS = ENDINGS;
}
