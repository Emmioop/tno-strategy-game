(function() {
'use strict';

// ── 基本设置 ──
let mobile_f2        = 1;          // 重开键开关
let mobile_heal      = 0;          // H 键开关
let mobile_cn        = 1;          // 面板语言
let button_extra_1   = 0;          // 拓展开关
let button_extra_2   = 0;
let button_extra_3   = 0;
let button_extra_4   = 0;
let scr_button       = 0;          // 隐藏 Scratch 原生按钮 (1=隐藏, 0=显示)
let GreenFlag_Start  = 0;          // 是否自动点击绿旗（1=自动, 0=不自动）
let Android_System_Keyboard = 1;   // 系统键盘按钮开关（1=显示, 0=隐藏）

// ── 键值配置 ──
let mobile_f2_key    = 113;        // F2
let mobile_heal_key  = 72;         // H
let button_extra_1_key = 49;       // 1
let button_extra_2_key = 50;       // 2
let button_extra_3_key = 51;       // 3
let button_extra_4_key = 52;       // 4

// ── 贴图配置（仅第二/三套键盘使用） ──
let mobile_f2_spr    = 'spr_button_restart';
let mobile_heal_spr  = 'spr_heal_button';
let button_extra_1_spr = 'spr_1_button';
let button_extra_2_spr = 'spr_2_button';
let button_extra_3_spr = 'spr_3_button';
let button_extra_4_spr = 'spr_4_button';

// ── 颜色常量 ──
const c_aqua    = 0x00FFFF;
const c_orange  = 0xFFA040;
const c_green   = 0x008000;
const c_yellow  = 0xFFFF00;
const c_white   = 0xFFFFFF;
const c_black   = 0x000000;
const c_red     = 0xFF0000;
const c_blue    = 0x0000FF;
const c_lime    = 0x00FF00;
const c_fuchsia = 0xFF00FF;
const c_gray    = 0x808080;
const c_maroon  = 0x800000;
const c_navy    = 0x000080;
const c_olive   = 0x808000;
const c_silver  = 0xC0C0C0;
const c_teal    = 0x008080;
const c_purple  = 0x800080;

const mb_left = 0;
const SETT_W = 38, SETT_H = 50, SETT_SCALE = 1;
const LONG_PRESS_DELAY = 500;
const EXTRA_RADIUS_FACTOR = 20 / 3.5;
let WORLD_W = 960, WORLD_H = 540;
const dpr = devicePixelRatio || 2;
const lang = mobile_cn;
const AKB_W = 38, AKB_H = 48;      // 系统键盘按钮尺寸 (19*2, 24*2)

let ui_state = parseInt(localStorage.getItem('ui_state')) || 2;
let settings_layout = parseInt(localStorage.getItem('settings_layout_mode')) || 0;
function saveSettingsLayout() { localStorage.setItem('settings_layout_mode', settings_layout); }

// ── 配置存储（仅用于第二套和第三套键盘） ──
const CFG_STORE_KEY = 'ctrl_all_cfg_final9';
const default_cfg = {
    stick: {
        controls_opacity:0.5, button_scale:3, analog_scale:3.5, joystick_type:0,
        zx:388, zy:338, xx:472, xy:294, cx:556, cy:253,
        settx:-50, setty:5, analog_posx:-42, analog_posy:232.5,
        heal_x:556, heal_y:5, f2_x:5, f2_y:5,
        extra1_x:90,  extra1_y:5,
        extra2_x:471, extra2_y:5,
        extra3_x:471, extra3_y:95,
        extra4_x:556, extra4_y:95,
        akb_x: -95, akb_y: 5         // 系统键盘按钮坐标（设置左侧）
    },
    dpad: {
        current_style:0,
        style0: {
            controls_opacity:0.5, button_scale:3, analog_scale:3.5, joystick_type:0,
            zx:388, zy:338, xx:472, xy:294, cx:556, cy:253,
            settx:-50, setty:5, upx:59, upy:194, leftx:-22, lefty:275,
            rightx:140, righty:275, downx:59, downy:356,
            heal_x:556, heal_y:5, f2_x:5, f2_y:5,
            extra1_x:90,  extra1_y:5,
            extra2_x:471, extra2_y:5,
            extra3_x:471, extra3_y:95,
            extra4_x:556, extra4_y:95,
            akb_x: -95, akb_y: 5
        },
        style1: {
            controls_opacity:0.5, button_scale:3, analog_scale:3.5, joystick_type:1,
            zx:434, zy:5, xx:518, xy:5, cx:603, cy:5,
            settx:-50, setty:5,
            upx:568, upy:215, downx:568, downy:335,
            leftx:-30, lefty:275, rightx:90, righty:275,
            heal_x:603, heal_y:95,
            f2_x:5, f2_y:5,
            extra1_x:90,  extra1_y:5,
            extra2_x:175, extra2_y:5,
            extra3_x:434, extra3_y:95,
            extra4_x:518, extra4_y:95,
            akb_x: -95, akb_y: 5
        }
    }
};

let cfg_all = JSON.parse(JSON.stringify(default_cfg));

function load_cfg_all() {
    try {
        const saved = JSON.parse(localStorage.getItem(CFG_STORE_KEY));
        if (saved) {
            if (saved.stick) Object.assign(cfg_all.stick, saved.stick);
            if (saved.dpad) {
                if (saved.dpad.current_style !== undefined) cfg_all.dpad.current_style = saved.dpad.current_style;
                if (saved.dpad.style0) Object.assign(cfg_all.dpad.style0, saved.dpad.style0);
                if (saved.dpad.style1) Object.assign(cfg_all.dpad.style1, saved.dpad.style1);
            }
        }
    } catch(e) {}
}
function save_cfg_all() { localStorage.setItem(CFG_STORE_KEY, JSON.stringify(cfg_all)); }

let controls_opacity, button_scale, analog_scale, joystick_type;
let zx, zy, xx, xy, cx, cy, settx, setty, upx, upy, leftx, lefty, rightx, righty, downx, downy;
let analog_posx, analog_posy, analog_cx, analog_cy;
let heal_x, heal_y, f2_x, f2_y;
let extra1_x, extra1_y, extra2_x, extra2_y, extra3_x, extra3_y, extra4_x, extra4_y;
let akb_x = -50, akb_y = 5;        // 系统键盘按钮坐标（第一套键盘固定默认值）
let stick_off_x=0, stick_off_y=0, stick_dir_x=0, stick_dir_y=0, stick_drag=false, stick_touch=null;
let last_arrow = { up:false, down:false, left:false, right:false };
let arrow_pressed_ctrl=null, arrow_pressed_side=null, arrow_longpress_timer=null, arrow_repeat_interval=null;
let toggle_cooldown=false, settings_down=false, reset_pending=false, reset_touch_id=null;

// ── 系统键盘状态管理 ──
let system_kb_active = false;
let _hidden_input = null;
let _lastInputValue = '';
let _kb_closing = false; // 标志：是否正在主动关闭系统键盘
let _kb_buf = '';        // 多键模式缓冲区
let _kb_multi = false;   // false=单键模式(小写直接发), true=多键模式(大写累积)

function _createHiddenInput() {
    if (_hidden_input) return;
    _hidden_input = document.createElement('input');
    _hidden_input.type = 'text';
    _hidden_input.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0;width:1px;height:1px;';
    _hidden_input.setAttribute('inputmode', 'text');
    // 监听输入，将字符转换为按键
    _hidden_input.addEventListener('input', function() {
        const val = _hidden_input.value;
        if (val.length > _lastInputValue.length) {
            const newChars = val.substring(_lastInputValue.length);
            for (const ch of newChars) _routeChar(ch);
        } else if (val.length < _lastInputValue.length) {
            // Backspace：单键模式发Backspace键，多键模式从缓冲区删
            const n = _lastInputValue.length - val.length;
            if (_kb_multi) { _kb_buf = _kb_buf.slice(0, -n) || ''; }
            else { for (let i=0;i<n;i++) { send_key('Backspace',true); setTimeout(()=>send_key('Backspace',false),50); } }
        }
        _lastInputValue = val;
    });

    // 当系统键盘激活时，防止意外失焦导致键盘退出（如按安卓返回键）
    // 但如果是主动关闭（_kb_closing 为 true），则允许失焦
    _hidden_input.addEventListener('blur', function() {
        // 只有真正是用户主动操作导致的失焦才重新聚焦
        // 排除：页面隐藏、窗口失焦、系统键盘被强制关闭等情况
        if (system_kb_active && !_kb_closing && !document.hidden && document.hasFocus()) {
            // 尝试重新聚焦
            setTimeout(() => {
                if (system_kb_active && _hidden_input && !_kb_closing && !document.hidden && document.hasFocus()) {
                    _hidden_input.focus({preventScroll: true});
                    // 延迟检查是否成功聚焦
                    setTimeout(() => {
                        if (system_kb_active && _hidden_input && document.activeElement !== _hidden_input) {
                            system_kb_active = false;
                        }
                    }, 200);
                }
            }, 100);
        }
        // 重置关闭标志
        _kb_closing = false;
    });

    document.body.appendChild(_hidden_input);
}

// ── 字符路由：根据大小写切换模式 ──
function _routeChar(ch) {
    const upper = (ch >= 'A' && ch <= 'Z');
    const lower = (ch >= 'a' && ch <= 'z');
    const enter = (ch === '\n' || ch === '\r');

    if (enter) {
        if (_kb_multi && _kb_buf) { _flushBuf(); }
        _emit('Enter');
        return;
    }

    if (upper) {
        if (!_kb_multi) { _kb_multi = true; _kb_buf = ''; }
        _kb_buf += ch;
        return;
    }

    if (lower) {
        if (_kb_multi) { _kb_multi = false; _kb_buf = ''; }
        _emit(ch.toUpperCase());
        return;
    }

    // 数字/符号/空格：跟随当前模式
    if (_kb_multi) { _kb_buf += ch; }
    else { _emit(ch === ' ' ? ' ' : ch); }
}

function _emit(key) {
    send_key(key, true);
    setTimeout(() => send_key(key, false), 50);
}

function _flushBuf() {
    for (const ch of _kb_buf) { _emit(ch === ' ' ? ' ' : ch.toUpperCase()); }
    _kb_buf = '';
}

function _openSystemKeyboard() {
    if (!_hidden_input) _createHiddenInput();
    // 页面在后台时不打开键盘
    if (document.hidden) return;
    system_kb_active = true;
    _kb_multi = false;
    _kb_buf = '';
    _lastInputValue = '';
    setTimeout(() => {
        if (!document.hidden && _hidden_input) {
            _hidden_input.focus({preventScroll: true});
        }
    }, 50);
}

function _closeSystemKeyboard() {
    if (!_hidden_input || !system_kb_active) return;
    _kb_multi = false; _kb_buf = ''; // 丢弃未发送的多键缓冲
    _kb_closing = true;
    system_kb_active = false;
    _hidden_input.blur();
    // 延迟清空输入框，确保键盘完全收起
    setTimeout(() => {
        _kb_closing = false;
        if (_hidden_input) {
            _hidden_input.value = '';
            _lastInputValue = '';
        }
    }, 200);
}

// ── 增强暂停/恢复逻辑（劫持式） ──
let runtime_frozen = false;
let _orig_step = null;
let _hijacked_by_mk = false;

function freeze_runtime() {
    if (runtime_frozen) return;
    runtime_frozen = true;
    for (const kc in keyIsDown) { if (keyIsDown[kc]) keyboard_key_release(Number(kc)); }
    const vm = getVM();
    if (!vm) return;
    if (typeof vm.pause === 'function') { vm.pause(); return; }
    if (vm.runtime) {
        if (!_hijacked_by_mk && typeof vm.runtime._step === 'function') {
            _orig_step = vm.runtime._step;
            vm.runtime._step = function() {
                if (runtime_frozen) return;
                return _orig_step.apply(this, arguments);
            };
            _hijacked_by_mk = true;
        }
        if (vm.runtime.audioEngine?.audioContext) { vm.runtime.audioEngine.audioContext.suspend().catch(() => {}); }
        if (vm.runtime.ioDevices?.clock?.pause) { vm.runtime.ioDevices.clock.pause(); }
    }
}

function unfreeze_runtime() {
    if (!runtime_frozen) return;
    runtime_frozen = false;
    const vm = getVM();
    if (!vm) return;
    if (typeof vm.resume === 'function') { vm.resume(); return; }
    if (vm.runtime) {
        if (vm.runtime.audioEngine?.audioContext) { vm.runtime.audioEngine.audioContext.resume().catch(() => {}); }
        if (vm.runtime.ioDevices?.clock?.resume) { vm.runtime.ioDevices.clock.resume(); }
    }
}

function handle_visibility() { document.hidden ? freeze_runtime() : unfreeze_runtime(); }

function restart_project() {
    const vm = getVM();

    // 方法1: 直接调用 vm.greenFlag() (Scratch GUI 标准方式)
    if (vm) {
        try {
            if (typeof vm.greenFlag === 'function') {
                if (typeof vm.start === 'function') vm.start();
                vm.greenFlag();
                if (runtime_frozen) unfreeze_runtime();
                return;
            }
            if (vm.runtime && typeof vm.runtime.greenFlag === 'function') {
                if (typeof vm.runtime.start === 'function') vm.runtime.start();
                vm.runtime.greenFlag();
                if (runtime_frozen) unfreeze_runtime();
                return;
            }
            // 旧版 SCR 可能用 stopAll + start + greenFlag
            if (typeof vm.stopAll === 'function') vm.stopAll();
            if (typeof vm.start === 'function') vm.start();
            if (typeof vm.greenFlag === 'function') {
                vm.greenFlag();
                if (runtime_frozen) unfreeze_runtime();
                return;
            }
            if (vm.runtime) {
                if (typeof vm.runtime.stopAll === 'function') vm.runtime.stopAll();
                if (typeof vm.runtime.start === 'function') vm.runtime.start();
                if (typeof vm.runtime.greenFlag === 'function') {
                    vm.runtime.greenFlag();
                    if (runtime_frozen) unfreeze_runtime();
                    return;
                }
            }
        } catch(e) {}
    }

    // 方法2: TurboWarp Scaffolding
    const scaffolding = window.scaffolding;
    if (scaffolding && typeof scaffolding.greenFlag === 'function') {
        try { scaffolding.stopAll(); } catch(e) {}
        try { scaffolding.greenFlag(); } catch(e) {}
        if (runtime_frozen) unfreeze_runtime();
        return;
    }

    // 方法3: 模拟点击绿旗按钮 (兜底方案)
    const greenFlagBtn = document.querySelector(
        '.green-flag, [class*="green-flag"], [class*="greenFlag"], ' +
        'img[src*="green-flag"], .stage_green-flag, [class*="greenFlag"]'
    );
    if (greenFlagBtn) {
        try {
            greenFlagBtn.click();
            if (runtime_frozen) unfreeze_runtime();
            return;
        } catch(e) {}
    }

    // 方法4: 通过 Scratch 舞台触发
    const stage = document.querySelector('.stage_stage-wrapper, [class*="stage-wrapper"], .stage-wrapper');
    if (stage) {
        try {
            const ev = new MouseEvent('click', { bubbles: true, cancelable: true });
            stage.dispatchEvent(ev);
            if (runtime_frozen) unfreeze_runtime();
            return;
        } catch(e) {}
    }
}

// ── 扩大的 Canvas 选择器 ──
function find_scratch_canvas() { 
    // 优先找 Construct 2 的 c2canvas
    let sc = document.getElementById('c2canvas');
    if (!sc) {
        sc = document.querySelector(
            'canvas.sc-canvas, canvas.sc-stage, canvas#scratch-stage, ' +
            'canvas#stage, canvas.stage, canvas[class*="stage"]'
        );
    }
    if (!sc) {
        const allCanvas = document.querySelectorAll('canvas');
        for (const cv of allCanvas) {
            if (cv.id !== 'virt-ctrl' && cv.id !== 'gml-gui') { sc = cv; break; }
        }
    }
    // ★ WORLD_W/H 必须锁定 960x540（Construct 2 项目的原始逻辑分辨率）
    // 不能用 canvas 物理尺寸，因为 C2 SetCanvasSize 会动态改物理尺寸
    // WORLD_W 和 WORLD_H 在文件顶部已初始化为 960 和 540，保持不变
    return sc;
}

// ── 判断触摸点是否在键盘控制区域内 ──
function is_touch_on_controls(clientX, clientY) {
    if (ui_state === 1) return false;
    const rect = canvas.getBoundingClientRect();
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}

function load_vars_from_cfg() {
    if (ui_state === 3) {
        const c = cfg_all.stick;
        controls_opacity = c.controls_opacity; button_scale = c.button_scale; analog_scale = c.analog_scale; joystick_type = c.joystick_type;
        zx = c.zx; zy = c.zy; xx = c.xx; xy = c.xy; cx = c.cx; cy = c.cy; settx = c.settx; setty = c.setty;
        analog_posx = c.analog_posx; analog_posy = c.analog_posy;
        heal_x = c.heal_x; heal_y = c.heal_y; f2_x = c.f2_x; f2_y = c.f2_y;
        extra1_x = c.extra1_x; extra1_y = c.extra1_y;
        extra2_x = c.extra2_x; extra2_y = c.extra2_y;
        extra3_x = c.extra3_x; extra3_y = c.extra3_y;
        extra4_x = c.extra4_x; extra4_y = c.extra4_y;
        akb_x = c.akb_x != null ? c.akb_x : -95;
        akb_y = c.akb_y != null ? c.akb_y : 5;
        analog_cx = analog_posx + 59 * analog_scale / 2;
        analog_cy = analog_posy + 59 * analog_scale / 2;
    } else if (ui_state === 4) {
        const s = cfg_all.dpad[`style${cfg_all.dpad.current_style}`] || cfg_all.dpad.style0;
        controls_opacity = s.controls_opacity; button_scale = s.button_scale; analog_scale = s.analog_scale; joystick_type = s.joystick_type;
        zx = s.zx; zy = s.zy; xx = s.xx; xy = s.xy; cx = s.cx; cy = s.cy; settx = s.settx; setty = s.setty;
        upx = s.upx; upy = s.upy; downx = s.downx; downy = s.downy;
        leftx = s.leftx; lefty = s.lefty; rightx = s.rightx; righty = s.righty;
        heal_x = s.heal_x; heal_y = s.heal_y; f2_x = s.f2_x; f2_y = s.f2_y;
        extra1_x = s.extra1_x; extra1_y = s.extra1_y;
        extra2_x = s.extra2_x; extra2_y = s.extra2_y;
        extra3_x = s.extra3_x; extra3_y = s.extra3_y;
        extra4_x = s.extra4_x; extra4_y = s.extra4_y;
        akb_x = s.akb_x != null ? s.akb_x : -95;
        akb_y = s.akb_y != null ? s.akb_y : 5;
    }
}
function save_vars_to_cfg() {
    if (ui_state === 3) {
        Object.assign(cfg_all.stick, { controls_opacity, button_scale, analog_scale, joystick_type,
            zx, zy, xx, xy, cx, cy, settx, setty, analog_posx, analog_posy,
            heal_x, heal_y, f2_x, f2_y, extra1_x, extra1_y, extra2_x, extra2_y, extra3_x, extra3_y, extra4_x, extra4_y,
            akb_x, akb_y });
    } else {
        cfg_all.dpad.current_style = joystick_type;
        Object.assign(cfg_all.dpad[`style${joystick_type}`], { controls_opacity, button_scale, analog_scale, joystick_type,
            zx, zy, xx, xy, cx, cy, settx, setty, upx, upy, downx, downy, leftx, lefty, rightx, righty,
            heal_x, heal_y, f2_x, f2_y, extra1_x, extra1_y, extra2_x, extra2_y, extra3_x, extra3_y, extra4_x, extra4_y,
            akb_x, akb_y });
    }
    save_cfg_all();
}

const audio_buffers = {};
function audio_play_sound(name) {
    let a = audio_buffers[name];
    if (!a) { a = new Audio(); a.preload='auto'; a.src=`MobileSound/${name}.ogg`; audio_buffers[name]=a; a.load(); }
    if (a.readyState >= 4) { a.currentTime=0; a.play().catch(()=>{}); }
    else {
        const onReady = () => { a.removeEventListener('canplaythrough',onReady); a.currentTime=0; a.play().catch(()=>{}); };
        a.addEventListener('canplaythrough',onReady,{once:true});
    }
}
function preloadAllNeededSounds() {
    ['snd_spearappear_mobile','snd_egg_mobile','snd_noise_mobile','snd_menu_confirm_mobile','snd_equip_mobile','snd_coin_mobile','snd_hurt_mobile','snd_save_sup','snd_mercyadd_mobile','snd_item_equip_mobile'].forEach(name => {
        if (!audio_buffers[name]) { const a=new Audio(); a.preload='auto'; a.src=`MobileSound/${name}.ogg`; audio_buffers[name]=a; a.load(); }
    });
}

const spriteCache = {};
let loaded=0, total=0;
let keyboard_ready = false;
let system_ready = false;  // 系统完全初始化标志，防止加载中误触发

function img_loaded() {
    if (++loaded === total) {
        keyboard_ready = true;
        requestAnimationFrame(draw);
    }
}
function load_sprite(name, subimg) {
    const key = `${name}_${subimg}`;
    if (spriteCache[key]) return spriteCache[key];
    total++;
    const img = new Image(); img.onload = img_loaded;
    img.src = `MobileGraphics/${name}/${name}_${subimg}.png`;
    return spriteCache[key] = img;
}
function get_sprite(name, subimg) { return load_sprite(name, subimg); }

const joy_base0=load_sprite('spr_joybase',0), joy_stick0=load_sprite('spr_joystick',0);
const joy_base1=load_sprite('spr_joybase',1), joy_stick1=load_sprite('spr_joystick',1);
const btn_z_n=load_sprite('spr_z_button',0), btn_z_p=load_sprite('spr_z_button',1);
const btn_x_n=load_sprite('spr_x_button',0), btn_x_p=load_sprite('spr_x_button',1);
const btn_c_n=load_sprite('spr_c_button',0), btn_c_p=load_sprite('spr_c_button',1);
const settings_n_img=load_sprite('spr_settings_mobile',0), settings_p_img=load_sprite('spr_settings_mobile',1);
const arrow_l_img=load_sprite('spr_arrow_leftright_mobile',0), arrow_r_img=load_sprite('spr_arrow_leftright_mobile',1);
const dir_up_n=load_sprite('spr_button_up',0), dir_up_p=load_sprite('spr_button_up',1);
const dir_left_n=load_sprite('spr_button_left',0), dir_left_p=load_sprite('spr_button_left',1);
const dir_down_n=load_sprite('spr_button_down',0), dir_down_p=load_sprite('spr_button_down',1);
const dir_right_n=load_sprite('spr_button_right',0), dir_right_p=load_sprite('spr_button_right',1);
const spr_mobilekey=load_sprite('spr_mobilekey',0);
const spr_akb_n = load_sprite('spr_mobile_pad', 0);
const spr_akb_p = load_sprite('spr_mobile_pad', 1);

load_sprite('spr_button_restart',0); load_sprite('spr_button_restart',1);
load_sprite('spr_heal_button',0);    load_sprite('spr_heal_button',1);
load_sprite('spr_1_button',0);       load_sprite('spr_1_button',1);
load_sprite('spr_2_button',0);       load_sprite('spr_2_button',1);
load_sprite('spr_3_button',0);       load_sprite('spr_3_button',1);
load_sprite('spr_4_button',0);       load_sprite('spr_4_button',1);
load_sprite('spr_5_button',0); load_sprite('spr_5_button',1);
load_sprite('spr_6_button',0); load_sprite('spr_6_button',1);
load_sprite('spr_space_button',0); load_sprite('spr_space_button',1);

function get_panel_img_obj(baseName) { return load_sprite(baseName, lang); }
function get_joy_base() { return joystick_type===0?joy_base0:joy_base1; }
function get_joy_stick() { return joystick_type===0?joy_stick0:joy_stick1; }
function get_settings_img(p) { return p?settings_p_img:settings_n_img; }

let joystick_font = false;
new FontFace('MobileFont','url(MobileFont/mnc.woff2)').load().then(f=>{document.fonts.add(f);joystick_font=true;draw();}).catch(()=>{});

// ── 改进的 Canvas 存活检测与重建 ──
let canvas, ctx, game_area={scale:1};
let stage_ready = false;   // ★ 舞台就绪标志
let _canvasCheckTimer = null;

function ensure_canvas_alive() {
    const w = innerWidth, h = innerHeight;
    let existing = document.getElementById('virt-ctrl');

    if (!existing) {
        canvas = document.createElement('canvas'); 
        canvas.id = 'virt-ctrl';
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:999999;touch-action:none;background:transparent;image-rendering:crisp-edges;';
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d'); 
        ctx.imageSmoothingEnabled = false;
    } else if (!canvas || canvas !== existing) {
        canvas = existing;
        ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
    }

    const targetWidth = w * dpr;
    const targetHeight = h * dpr;
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';
    }

    if (document.body.lastElementChild !== canvas) {
        document.body.appendChild(canvas);
    }
}

function scheduleCanvasCheck() {
    if (_canvasCheckTimer) return;
    _canvasCheckTimer = setTimeout(() => {
        _canvasCheckTimer = null;
        ensure_canvas_alive();
    }, 1000);
}

function update_area() {
    const w = innerWidth, h = innerHeight;
    let sc = find_scratch_canvas();

    if (!sc) {
        // ★ 找不到游戏 canvas 时，用全屏作 fallback，保持就绪
        stage_ready = true;
        game_area = { x: 0, y: 0, w: w, h: h, scale: Math.min(w / WORLD_W, h / WORLD_H) };
        ensure_canvas_alive();
        return true;
    }

    const rect = sc.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
        stage_ready = true;
        game_area = { x: 0, y: 0, w: w, h: h, scale: Math.min(w / WORLD_W, h / WORLD_H) };
        ensure_canvas_alive();
        return true;
    }

    // ★ 强制用 960x540 逻辑分辨率算 scale，不要用 canvas 物理尺寸
    // 因为 Construct 2 SetCanvasSize 会动态改 canvas.width/height 但逻辑坐标还是 960x540
    const aw = WORLD_W, ah = WORLD_H;
    const fit = Math.min(rect.width / aw, rect.height / ah);
    const dw = aw * fit, dh = ah * fit;
    const left = rect.left + (rect.width - dw) / 2;
    const top = rect.top + (rect.height - dh) / 2;
    const gs = fit;

    game_area = {
        x: left + (dw - WORLD_W * gs) / 2,
        y: top + (dh - WORLD_H * gs) / 2,
        w: WORLD_W * gs,
        h: WORLD_H * gs,
        scale: gs
    };

    stage_ready = true;   // ★ 舞台有效，标记就绪
    ensure_canvas_alive();
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    return true;
}

function world_xy(cx, cy) {
    const g = game_area;
    if (!g || !g.scale || g.scale <= 0) return { x: -1000, y: -1000 };
    return {
        x: (cx - g.x) / g.scale,
        y: (cy - g.y) / g.scale
    };
}

const keyIsDown={}, _keysPressed={};
function _keyboardBeginStep() { for(const k in _keysPressed) delete _keysPressed[k]; }
function keyboard_key_press(kc) {
    if(!keyIsDown[kc]) {
        keyIsDown[kc]=true; _keysPressed[kc]=true;
        const n={
            38:'ArrowUp',40:'ArrowDown',37:'ArrowLeft',39:'ArrowRight',
            90:'Z',88:'X',67:'C',92:'Settings',16:'Shift',
            72:'H',113:'F2',49:'1',50:'2',51:'3',52:'4',
            105:'Numpad9'
        }[kc];
        if(n) send_key(n, true);
    }
}
function keyboard_key_release(kc) {
    if(keyIsDown[kc]) {
        keyIsDown[kc]=false;
        const n={
            38:'ArrowUp',40:'ArrowDown',37:'ArrowLeft',39:'ArrowRight',
            90:'Z',88:'X',67:'C',92:'Settings',16:'Shift',
            72:'H',113:'F2',49:'1',50:'2',51:'3',52:'4',
            105:'Numpad9'
        }[kc];
        if(n) send_key(n, false);
    }
}
function keyboard_check(kc) { return !!keyIsDown[kc]; }
function keyboard_check_pressed(kc) { return !!_keysPressed[kc]; }
function send_key(key, down) {
    const kc={
        ArrowUp:38,ArrowDown:40,ArrowLeft:37,ArrowRight:39,
        Z:90,X:88,C:67,Settings:92,Shift:16,
        H:72,F2:113,'1':49,'2':50,'3':51,'4':52,
        Numpad9:105,
        Backspace:8
    }[key];
    if(!kc) return;
    const ev=new KeyboardEvent(down?'keydown':'keyup',{key, code:key.startsWith('Arrow')?key:`Key${key}`, keyCode:kc, which:kc, bubbles:true});
    document.dispatchEvent(ev);
    const sc=find_scratch_canvas(); if(sc) sc.dispatchEvent(ev);
    const vm = getVM();
    if(vm?.runtime?.ioDevices?.keyboard) vm.runtime.ioDevices.keyboard.postData({key, isDown:down});
}

const _pointers={}, _pointerDown={};
let _pointerSlots=[null,null,null,null,null];
function _updatePointerSlots() {
    _pointerSlots=[null,null,null,null,null];
    let idx=0;
    for(const id in _pointerDown) if(_pointerDown[id]&&idx<4) _pointerSlots[idx++]=id;
}
function device_mouse_x_to_gui(device) { const id=_pointerSlots[device]; return id!=null&&_pointers[id]?_pointers[id].wx:-1000; }
function device_mouse_y_to_gui(device) { const id=_pointerSlots[device]; return id!=null&&_pointers[id]?_pointers[id].wy:-1000; }
function device_mouse_check_button(device, button) { const id=_pointerSlots[device]; return id!=null&&!!_pointerDown[id]; }
function device_mouse_check_button_pressed(device, button) { const id=_pointerSlots[device]; return id!=null&&_pointers[id]&&_pointers[id].justPressed; }
function mouse_check_button_pressed(button) { for(let d=0;d<4;d++) if(device_mouse_check_button_pressed(d,button)) return true; return false; }

function gms_col(col) {
    if(col===undefined||col===0xFFFFFF) return 'rgba(255,255,255,1)';
    const b=(col&0xFF)/255, g=((col>>8)&0xFF)/255, r=((col>>16)&0xFF)/255;
    return `rgba(${r*255},${g*255},${b*255},1)`;
}
function fmt_num(v) { return Number.isInteger(v)?Math.round(v).toString():v.toFixed(2); }

let _draw_alpha=1;
function draw_set_alpha(a) { _draw_alpha=a; }
function draw_sprite_ext(sprite, subimg, x, y, xscale, yscale, rot, colour, alpha) {
    if(!sprite?.complete) return;
    ctx.save(); ctx.globalAlpha=_draw_alpha*alpha;
    ctx.drawImage(sprite, x, y, sprite.naturalWidth*xscale, sprite.naturalHeight*yscale);
    if(colour!==undefined&&colour!==c_white) {
        ctx.globalCompositeOperation='source-in';
        ctx.fillStyle=gms_col(colour); ctx.fillRect(x, y, sprite.naturalWidth*xscale, sprite.naturalHeight*yscale);
    }
    ctx.restore();
}
function draw_colored(sprite, x, y, w, h, col, alpha) {
    const t=document.createElement('canvas'); t.width=Math.ceil(w); t.height=Math.ceil(h);
    const tc=t.getContext('2d'); tc.imageSmoothingEnabled=false;
    tc.drawImage(sprite,0,0,w,h); tc.globalCompositeOperation='source-atop';
    tc.fillStyle=gms_col(col); tc.fillRect(0,0,w,h);
    ctx.save(); ctx.globalAlpha=alpha; ctx.drawImage(t,x,y); ctx.restore();
}
function draw_roundrect_color(x1,y1,x2,y2,col1,col2,outline) {
    const lx=Math.min(x1,x2), rx=Math.max(x1,x2), ty=Math.min(y1,y2), by=Math.max(y1,y2);
    const w=rx-lx, h=by-ty, r=Math.min(6,w/2,h/2);
    ctx.save(); ctx.globalAlpha=_draw_alpha; ctx.imageSmoothingEnabled=false;
    ctx.beginPath(); ctx.moveTo(lx+r,ty); ctx.lineTo(rx-r,ty); ctx.quadraticCurveTo(rx,ty,rx,ty+r);
    ctx.lineTo(rx,by-r); ctx.quadraticCurveTo(rx,by,rx-r,by); ctx.lineTo(lx+r,by);
    ctx.quadraticCurveTo(lx,by,lx,by-r); ctx.lineTo(lx,ty+r); ctx.quadraticCurveTo(lx,ty,lx+r,ty);
    ctx.closePath();
    if(outline) { ctx.strokeStyle=col2; ctx.lineWidth=1; ctx.stroke(); }
    else { ctx.fillStyle=col1; ctx.fill(); }
    ctx.restore();
}

function update_arrows() {
    const dz=0.18;
    const u=stick_dir_y<-dz, d=stick_dir_y>dz, l=stick_dir_x<-dz, r=stick_dir_x>dz;
    if(u!==last_arrow.up) { send_key('ArrowUp',u); last_arrow.up=u; }
    if(d!==last_arrow.down) { send_key('ArrowDown',d); last_arrow.down=d; }
    if(l!==last_arrow.left) { send_key('ArrowLeft',l); last_arrow.left=l; }
    if(r!==last_arrow.right) { send_key('ArrowRight',r); last_arrow.right=r; }
}
function drag_stick(wx, wy) {
    const maxR=59*analog_scale/2;
    let dx=wx-analog_cx, dy=wy-analog_cy;
    const dist=Math.hypot(dx,dy);
    if(dist>maxR) { dx=dx/dist*maxR; dy=dy/dist*maxR; }
    stick_off_x=dx; stick_off_y=dy; stick_dir_x=dx/maxR; stick_dir_y=dy/maxR;
    update_arrows();
}
function reset_stick() { stick_drag=false; stick_touch=null; stick_off_x=0; stick_off_y=0; stick_dir_x=0; stick_dir_y=0; update_arrows(); }

const _vkList=[];
let _vkNextId=1;
function virtual_key_add(x,y,w,h,keycode) { _vkList.push({id:_vkNextId++, x,y,w,h,keycode}); }
function _createAllVirtualKeys(self) {
    _vkList.length=0;
    if(!self) return;
    if(self.edit) { virtual_key_add(sett_x(),sett_y(),38,50,92); return; }
    const km = self.key_map || {
        z:90, x:88, c:67, up:38, down:40, left:37, right:39,
        h:mobile_heal_key, f2:mobile_f2_key,
        extra1:button_extra_1_key, extra2:button_extra_2_key,
        extra3:button_extra_3_key, extra4:button_extra_4_key
    };
    if(ui_state===3) {
        virtual_key_add(zx, zy, 27*button_scale, 29*button_scale, km.z);
        virtual_key_add(xx, xy, 27*button_scale, 29*button_scale, km.x);
        virtual_key_add(cx, cy, 27*button_scale, 29*button_scale, km.c);
        if (mobile_heal) virtual_key_add(heal_x, heal_y, 27*button_scale, 29*button_scale, km.h);
        if (mobile_f2)  virtual_key_add(f2_x, f2_y, 27*button_scale, 29*button_scale, km.f2);
        if (button_extra_1) virtual_key_add(extra1_x, extra1_y, 27*button_scale, 29*button_scale, km.extra1);
        if (button_extra_2) virtual_key_add(extra2_x, extra2_y, 27*button_scale, 29*button_scale, km.extra2);
        if (button_extra_3) virtual_key_add(extra3_x, extra3_y, 27*button_scale, 29*button_scale, km.extra3);
        if (button_extra_4) virtual_key_add(extra4_x, extra4_y, 27*button_scale, 29*button_scale, km.extra4);
        if (Android_System_Keyboard) virtual_key_add(akb_x, akb_y, AKB_W, AKB_H, 105);
        const back=45*analog_scale, area=19.675*analog_scale, full=59*analog_scale;
        virtual_key_add(analog_posx-back, analog_posy-back, full+2*back, area+back, km.up);
        virtual_key_add(analog_posx-back, analog_posy+full-area, full+2*back, area+back, km.down);
        virtual_key_add(analog_posx-back, analog_posy-back, area+back, full+2*back, km.left);
        virtual_key_add(analog_posx+full-area, analog_posy-back, area+back, full+2*back, km.right);
        virtual_key_add(analog_posx-back, analog_posy-back, full+2*back, full+2*back, 16);
    } else if(ui_state===4) {
        virtual_key_add(zx, zy, 27*button_scale, 29*button_scale, km.z);
        virtual_key_add(xx, xy, 27*button_scale, 29*button_scale, km.x);
        virtual_key_add(cx, cy, 27*button_scale, 29*button_scale, km.c);
        if (mobile_heal) virtual_key_add(heal_x, heal_y, 27*button_scale, 29*button_scale, km.h);
        if (mobile_f2)  virtual_key_add(f2_x, f2_y, 27*button_scale, 29*button_scale, km.f2);
        if (button_extra_1) virtual_key_add(extra1_x, extra1_y, 27*button_scale, 29*button_scale, km.extra1);
        if (button_extra_2) virtual_key_add(extra2_x, extra2_y, 27*button_scale, 29*button_scale, km.extra2);
        if (button_extra_3) virtual_key_add(extra3_x, extra3_y, 27*button_scale, 29*button_scale, km.extra3);
        if (button_extra_4) virtual_key_add(extra4_x, extra4_y, 27*button_scale, 29*button_scale, km.extra4);
        if (Android_System_Keyboard) virtual_key_add(akb_x, akb_y, AKB_W, AKB_H, 105);
        virtual_key_add(upx, upy, 27*analog_scale, 29*analog_scale, km.up);
        virtual_key_add(downx, downy, 27*analog_scale, 29*analog_scale, km.down);
        virtual_key_add(leftx, lefty, 27*analog_scale, 29*analog_scale, km.left);
        virtual_key_add(rightx, righty, 27*analog_scale, 29*analog_scale, km.right);
    }
    virtual_key_add(sett_x(), sett_y(), 38, 50, 92);
}
function sett_x() { return settx; }
function sett_y() { return setty; }
function _virtualKeysProcessTouches() {
    if(!_vkList.length) return;
    const touched={};
    for(const vk of _vkList) {
        if(vk.keycode===92) continue;
        for(const pid in _pointerDown) {
            if(!_pointerDown[pid]) continue;
            const p=_pointers[pid];
            if(p.wx>=vk.x&&p.wy>=vk.y&&p.wx<=vk.x+vk.w&&p.wy<=vk.y+vk.h) { touched[vk.keycode]=true; break; }
        }
    }
    for(const k in keyIsDown) { const kc=Number(k); if(keyIsDown[kc]&&!touched[kc]) keyboard_key_release(kc); }
    for(const kc in touched) { if(!keyboard_check(Number(kc))) keyboard_key_press(Number(kc)); }
}

const instances = { obj_mobilekey:null, obj_mobilecontrols:null, obj_mobilecontrols_button:null };
function instance_create_depth(x, y, depth, name) {
    let inst = null;
    if (name === 'obj_mobilekey') inst = obj_mobilekey_Create_0();
    else if (name === 'obj_mobilecontrols') inst = obj_mobilecontrols_Create_0();
    else if (name === 'obj_mobilecontrols_button') inst = obj_mobilecontrols_button_Create_0();
    instances[name] = inst;
    return inst;
}
function instance_destroy(name) {
    if (name === 'obj_mobilecontrols' && instances[name]) obj_mobilecontrols_CleanUp_0(instances[name]);
    if (name === 'obj_mobilecontrols_button' && instances[name]) obj_mobilecontrols_button_CleanUp_0(instances[name]);
    instances[name] = null;
}

function apply_dpad_style() {
    if (ui_state !== 4) return;
    const s = cfg_all.dpad[`style${joystick_type}`];
    upx=s.upx; upy=s.upy; downx=s.downx; downy=s.downy;
    leftx=s.leftx; lefty=s.lefty; rightx=s.rightx; righty=s.righty;
    zx=s.zx; zy=s.zy; xx=s.xx; xy=s.xy; cx=s.cx; cy=s.cy; settx=s.settx; setty=s.setty;
    heal_x=s.heal_x; heal_y=s.heal_y; f2_x=s.f2_x; f2_y=s.f2_y;
    extra1_x=s.extra1_x; extra1_y=s.extra1_y;
    extra2_x=s.extra2_x; extra2_y=s.extra2_y;
    extra3_x=s.extra3_x; extra3_y=s.extra3_y;
    extra4_x=s.extra4_x; extra4_y=s.extra4_y;
    button_scale=s.button_scale; analog_scale=s.analog_scale; controls_opacity=s.controls_opacity;
}

// ── 面板定义 ──
const PANEL_NEW = (() => {
    const lCX = w => (640 - w*2)/2;
    const oLX=281, oRX=321, ext=13, exL=15, exR=15;
    const aRX = oLX - ext - exL, aRW = 41 + ext*2 + exL + exR;
    const lX1=aRX, lX2=oRX, rX1=oRX, rX2=oRX+42+ext+exR;
    const nX=oRX, lH={btn:24, analog:24, type:24, opacity:26}, offY=10, aEY=4;
    const row = (id, y, val) => ({
        id, x:aRX, y: y + lH[id==='btnScale'?'btn':id==='analogScale'?'analog':id==='analogType'?'type':'opacity'] + offY + aEY + 2,
        sx:2, sy:2, w:aRW, h:9,
        left:{x1:lX1, x2:lX2}, right:{x1:rX1, x2:rX2}, val,
        numX:nX,
        numY: y + lH[id==='btnScale'?'btn':id==='analogScale'?'analog':id==='analogType'?'type':'opacity'] + offY + aEY + 9 + 3,
        arrowLeftX:oLX, arrowRightX:oRX
    });
    return [
        row('btnScale', 75, () => button_scale),
        { id:'btnScaleDisp', img:'spr_button_scale', x:lCX(79), y:75+offY, sx:2, sy:2 },
        row('analogScale', 145, () => analog_scale),
        { id:'analogScaleDisp', img:'spr_analog_scale', x:lCX(79), y:145+offY, sx:2, sy:2 },
        row('analogType', 215, () => joystick_type),
        { id:'analogTypeDisp', img:'spr_analog_type', x:lCX(72), y:215+offY, sx:2, sy:2 },
        row('opacity', 285, () => controls_opacity),
        { id:'opacityDisp', img:'spr_controls_opacity', x:lCX(107), y:285+offY, sx:2, sy:2 },
        { id:'configDisp', img:'spr_controls_config', x:170, y:22.5, sx:3, sy:3 },
        { id:'reset', img:'spr_reset_config', x:241, y:412.25, sx:2, sy:2, action:'resetAll' }
    ];
})();

const PANEL_OLD = [
    { id:'btnScale', x:459.5, y:75+2, sx:2, sy:2, w:41, h:9, left:{x1:440.5,x2:469.5}, right:{x1:531.5,x2:561.5}, numX:503, numY:85+3, val:()=>button_scale, arrowLeftX:459.5, arrowRightX:501.5 },
    { id:'analogScale', x:459.5, y:121+2, sx:2, sy:2, w:41, h:9, left:{x1:440.5,x2:469.5}, right:{x1:531.5,x2:561.5}, numX:503, numY:131+3, val:()=>analog_scale, arrowLeftX:459.5, arrowRightX:501.5 },
    { id:'analogType', x:459.5, y:167+2, sx:2, sy:2, w:41, h:9, left:{x1:440.5,x2:469.5}, right:{x1:531.5,x2:561.5}, numX:503, numY:177+3, val:()=>joystick_type, arrowLeftX:459.5, arrowRightX:501.5 },
    { id:'opacity', x:459.5, y:213+2, sx:2, sy:2, w:41, h:9, left:{x1:440.5,x2:469.5}, right:{x1:531.5,x2:561.5}, numX:503, numY:223+3, val:()=>controls_opacity, arrowLeftX:459.5, arrowRightX:501.5 },
    { id:'btnScaleDisp', img:'spr_button_scale', x:120.5, y:75, sx:2, sy:2 },
    { id:'analogScaleDisp', img:'spr_analog_scale', x:120.5, y:121, sx:2, sy:2 },
    { id:'analogTypeDisp', img:'spr_analog_type', x:124, y:167, sx:2, sy:2 },
    { id:'opacityDisp', img:'spr_controls_opacity', x:106.5, y:213, sx:2, sy:2 },
    { id:'configDisp', img:'spr_controls_config', x:220, y:22.5, sx:2, sy:2 },
    { id:'reset', img:'spr_reset_config', x:241, y:412.25, sx:2, sy:2, action:'resetAll' }
];
const get_panel = () => settings_layout===1 ? PANEL_OLD : PANEL_NEW;

function panel_click(id, side) {
    const dec = side==='left';
    let changed = true;
    const oldBS=button_scale, oldAS=analog_scale;
    if (id==='btnScale') {
        if (dec) { if (button_scale>1) button_scale-=0.1; else changed=false; }
        else button_scale+=0.1;
        if (changed) { const dx=(button_scale-oldBS)*13.5, dy=(button_scale-oldBS)*14.5; zx-=dx; zy-=dy; xx-=dx; xy-=dy; cx-=dx; cy-=dy; }
    } else if (id==='analogScale') {
        if (dec) { if (analog_scale>1) analog_scale-=0.1; else changed=false; }
        else analog_scale+=0.1;
        if (changed) {
            const ocx=analog_posx+59*oldAS/2, ocy=analog_posy+59*oldAS/2;
            analog_posx=ocx-59*analog_scale/2; analog_posy=ocy-59*analog_scale/2;
            analog_cx=ocx; analog_cy=ocy;
            if (ui_state===4) { const ddx=(analog_scale-oldAS)*13.5, ddy=(analog_scale-oldAS)*14.5; upx-=ddx; upy-=ddy; downx-=ddx; downy-=ddy; leftx-=ddx; lefty-=ddy; rightx-=ddx; righty-=ddy; }
        }
    } else if (id==='analogType') {
        if (dec) { if (joystick_type>0) { joystick_type--; if (ui_state===4) apply_dpad_style(); } else changed=false; }
        else { if (joystick_type<1) { joystick_type++; if (ui_state===4) apply_dpad_style(); } else changed=false; }
    } else if (id==='opacity') {
        if (dec) { if (controls_opacity>0.1) controls_opacity-=0.05; else changed=false; }
        else { if (controls_opacity<1) controls_opacity+=0.05; else changed=false; }
    }
    if (changed) audio_play_sound(dec?'snd_equip_mobile':'snd_coin_mobile');
    else audio_play_sound('snd_hurt_mobile');
    if (id==='analogScale') { analog_cx=analog_posx+59*analog_scale/2; analog_cy=analog_posy+59*analog_scale/2; }
    return changed;
}

function startArrowRepeat(id, side) {
    stopArrowLongpress();
    arrow_pressed_ctrl=id; arrow_pressed_side=side;
    arrow_longpress_timer = setTimeout(() => {
        arrow_repeat_interval = setInterval(() => {
            if (!panel_click(id, side)) { stopArrowLongpress(); arrow_pressed_ctrl=null; arrow_pressed_side=null; draw(); }
            else if (id==='analogScale') draw();
        }, 100);
    }, LONG_PRESS_DELAY);
}
function stopArrowLongpress() {
    if (arrow_longpress_timer) { clearTimeout(arrow_longpress_timer); arrow_longpress_timer=null; }
    if (arrow_repeat_interval) { clearInterval(arrow_repeat_interval); arrow_repeat_interval=null; }
}

function getSettingsTouchState() {
    let sett_touched=false, sett_just_pressed=false, sett_touch_id=null;
    for (const pid in _pointerDown) {
        if (!_pointerDown[pid]) continue;
        const p=_pointers[pid];
        if (p.wx>=settx && p.wx<=settx+SETT_W && p.wy>=setty && p.wy<=setty+SETT_H) {
            sett_touched=true;
            if (p.justPressed) { sett_just_pressed=true; sett_touch_id=pid; }
        }
    }
    return { sett_touched, sett_just_pressed, sett_touch_id };
}

function applyTransition(self) {
    self.black_fade = self.edit ? Math.min(self.black_fade+0.0134, 0.4) : Math.max(self.black_fade-0.0134, 0);
    self.text_black_fade = self.edit ? Math.min(self.text_black_fade+0.03, 0.9) : Math.max(self.text_black_fade-0.03, 0);
}

function handleKeyboardToggle(self, toggleFunc) {
    if (keyboard_check_pressed(92) && !toggle_cooldown) {
        toggle_cooldown=true;
        setTimeout(() => { toggle_cooldown=false; }, 200);
        toggleFunc(self);
    }
}

function handleSettingsDelay(self, sett_just_pressed, sett_touch_id, toggleFunc) {
    if (sett_just_pressed && self.active_key===-1 && !self.settings_pending) {
        self.settings_pending=true; self.settings_touch_id=sett_touch_id; self.settings_press_start=Date.now();
    }
    if (self.settings_pending) {
        const stillDown = self.settings_touch_id && _pointerDown[self.settings_touch_id];
        if (stillDown) {
            if (Date.now()-self.settings_press_start >= 500) {
                const p=_pointers[self.settings_touch_id];
                self.active_key=126; settx=p.wx-19; setty=p.wy-25;
                audio_play_sound('snd_noise_mobile');
                self.settings_pending=false; self.settings_touch_id=null;
            }
        } else {
            self.settings_pending=false; self.settings_touch_id=null; toggleFunc(self);
        }
    }
}

function canChange(id, side) {
    const dec=side==='left';
    if (id==='btnScale') return dec ? button_scale>1 : true;
    if (id==='analogScale') return dec ? analog_scale>1 : true;
    if (id==='analogType') return dec ? joystick_type>0 : joystick_type<1;
    if (id==='opacity') return dec ? controls_opacity>0.1 : controls_opacity<1;
    return true;
}

function processArrows(mx, my, mb) {
    const panel=get_panel();
    const rows=panel.filter(c=>c.left&&c.right);
    let found=false;
    for(const row of rows) {
        const leftX=row.arrowLeftX??row.left.x1, rightX=row.arrowRightX??row.right.x2;
        const topY=row.y-2, botY=row.y+18+2;
        if(mx>=leftX-18 && mx<=row.numX && my>=topY && my<=botY) {
            found=true;
            if(mb) {
                if(panel_click(row.id,'left')||canChange(row.id,'left')) {
                    if(arrow_pressed_ctrl!==row.id||arrow_pressed_side!=='left') startArrowRepeat(row.id,'left');
                } else { stopArrowLongpress(); arrow_pressed_ctrl=null; arrow_pressed_side=null; }
            }
            draw(); break;
        }
        if(mx>=row.numX && mx<=rightX+40 && my>=topY && my<=botY) {
            found=true;
            if(mb) {
                if(panel_click(row.id,'right')||canChange(row.id,'right')) {
                    if(arrow_pressed_ctrl!==row.id||arrow_pressed_side!=='right') startArrowRepeat(row.id,'right');
                } else { stopArrowLongpress(); arrow_pressed_ctrl=null; arrow_pressed_side=null; }
            }
            draw(); break;
        }
    }
    if(!found) { stopArrowLongpress(); arrow_pressed_ctrl=null; arrow_pressed_side=null; }
    return found;
}

function processResetButton(isStick) {
    let touchInReset=false, touchId=null;
    for(const pid in _pointerDown) {
        if(!_pointerDown[pid]) continue;
        const p=_pointers[pid];
        if(p.wx>=241 && p.wx<=399 && p.wy>=412.25 && p.wy<=436.25) { touchInReset=true; touchId=pid; break; }
    }
    if(touchInReset) { if(!reset_pending) { reset_pending=true; reset_touch_id=touchId; } }
    else {
        if(reset_pending) {
            if(reset_touch_id && !_pointerDown[reset_touch_id]) { if(isStick) reset_all(); else reset_all_button(); }
            reset_pending=false; reset_touch_id=null;
        }
    }
}

function processDragStart(self, mx, my, mb, isStick) {
    const btnHitR=Math.hypot(13.5*button_scale, 14.5*button_scale);
    const dirHitR=Math.hypot(13.5*analog_scale, 14.5*analog_scale);
    if(!mb) return;
    if(Math.hypot(mx-(zx+13.5*button_scale), my-(zy+14.5*button_scale))<=btnHitR) { self.active_key=125; audio_play_sound('snd_noise_mobile'); }
    else if(Math.hypot(mx-(xx+13.5*button_scale), my-(xy+14.5*button_scale))<=btnHitR) { self.active_key=124; audio_play_sound('snd_noise_mobile'); }
    else if(Math.hypot(mx-(cx+13.5*button_scale), my-(cy+14.5*button_scale))<=btnHitR) { self.active_key=94; audio_play_sound('snd_noise_mobile'); }
    else if (mobile_heal && Math.hypot(mx-(heal_x+13.5*button_scale), my-(heal_y+14.5*button_scale))<=btnHitR) { self.active_key=101; audio_play_sound('snd_noise_mobile'); }
    else if (mobile_f2  && Math.hypot(mx-(f2_x+13.5*button_scale), my-(f2_y+14.5*button_scale))<=btnHitR) { self.active_key=102; audio_play_sound('snd_noise_mobile'); }
    else if (button_extra_1 && Math.hypot(mx-(extra1_x+13.5*button_scale), my-(extra1_y+14.5*button_scale))<=btnHitR) { self.active_key=103; audio_play_sound('snd_noise_mobile'); }
    else if (button_extra_2 && Math.hypot(mx-(extra2_x+13.5*button_scale), my-(extra2_y+14.5*button_scale))<=btnHitR) { self.active_key=104; audio_play_sound('snd_noise_mobile'); }
    else if (button_extra_3 && Math.hypot(mx-(extra3_x+13.5*button_scale), my-(extra3_y+14.5*button_scale))<=btnHitR) { self.active_key=105; audio_play_sound('snd_noise_mobile'); }
    else if (button_extra_4 && Math.hypot(mx-(extra4_x+13.5*button_scale), my-(extra4_y+14.5*button_scale))<=btnHitR) { self.active_key=106; audio_play_sound('snd_noise_mobile'); }
    else if (Android_System_Keyboard && Math.hypot(mx-(akb_x+AKB_W/2), my-(akb_y+AKB_H/2))<=Math.hypot(AKB_W/2, AKB_H/2)+5) { self.active_key=127; audio_play_sound('snd_noise_mobile'); }
    else if(isStick && Math.hypot(mx-analog_cx, my-analog_cy)<=29.5*analog_scale+EXTRA_RADIUS_FACTOR*analog_scale) { self.active_key=93; audio_play_sound('snd_noise_mobile'); }
    else if(!isStick) {
        if(Math.hypot(mx-(upx+13.5*analog_scale), my-(upy+14.5*analog_scale))<=dirHitR) { self.active_key=97; audio_play_sound('snd_noise_mobile'); }
        else if(Math.hypot(mx-(downx+13.5*analog_scale), my-(downy+14.5*analog_scale))<=dirHitR) { self.active_key=98; audio_play_sound('snd_noise_mobile'); }
        else if(Math.hypot(mx-(leftx+13.5*analog_scale), my-(lefty+14.5*analog_scale))<=dirHitR) { self.active_key=99; audio_play_sound('snd_noise_mobile'); }
        else if(Math.hypot(mx-(rightx+13.5*analog_scale), my-(righty+14.5*analog_scale))<=dirHitR) { self.active_key=100; audio_play_sound('snd_noise_mobile'); }
    }
}

function processDragMove(self) {
    if(self.active_key===-1) return;
    const p0=_pointers[_pointerSlots[0]];
    if(p0 && _pointerDown[_pointerSlots[0]]) {
        const wx=p0.wx, wy=p0.wy;
        if(self.active_key===125) { zx=wx-13.5*button_scale; zy=wy-12.5*button_scale; }
        else if(self.active_key===124) { xx=wx-13.5*button_scale; xy=wy-12.5*button_scale; }
        else if(self.active_key===94) { cx=wx-13.5*button_scale; cy=wy-12.5*button_scale; }
        else if(self.active_key===101) { heal_x=wx-13.5*button_scale; heal_y=wy-12.5*button_scale; }
        else if(self.active_key===102) { f2_x=wx-13.5*button_scale; f2_y=wy-12.5*button_scale; }
        else if(self.active_key===103) { extra1_x=wx-13.5*button_scale; extra1_y=wy-12.5*button_scale; }
        else if(self.active_key===104) { extra2_x=wx-13.5*button_scale; extra2_y=wy-12.5*button_scale; }
        else if(self.active_key===105) { extra3_x=wx-13.5*button_scale; extra3_y=wy-12.5*button_scale; }
        else if(self.active_key===106) { extra4_x=wx-13.5*button_scale; extra4_y=wy-12.5*button_scale; }
        else if(self.active_key===127) { akb_x=wx-AKB_W/2; akb_y=wy-AKB_H/2; }
        else if(self.active_key===93) { analog_posx=wx-29.5*analog_scale; analog_posy=wy-29.5*analog_scale; analog_cx=analog_posx+29.5*analog_scale; analog_cy=analog_posy+29.5*analog_scale; }
        else if(self.active_key===126) { settx=wx-19; setty=wy-25; }
        else if(self.active_key===97) { upx=wx-13.5*analog_scale; upy=wy-12.5*analog_scale; }
        else if(self.active_key===98) { downx=wx-13.5*analog_scale; downy=wy-12.5*analog_scale; }
        else if(self.active_key===99) { leftx=wx-13.5*analog_scale; lefty=wy-12.5*analog_scale; }
        else if(self.active_key===100) { rightx=wx-13.5*analog_scale; righty=wy-12.5*analog_scale; }
        draw();
    } else { audio_play_sound('snd_menu_confirm_mobile'); self.active_key=-1; save_vars_to_cfg(); }
}

function drawPanel(self, isStick) {
    ctx.fillStyle=`rgba(0,0,0,${self.black_fade})`;
    ctx.fillRect(0,0,WORLD_W,WORLD_H);
    if(self.edit||self.black_fade>0) {
        const panel=get_panel();
        draw_set_alpha(1);
        for(const c of panel) {
            if(c.left) {
                const lx=c.arrowLeftX??c.x, rx=c.arrowRightX??(c.x+20*c.sx);
                if(arrow_l_img?.complete) draw_colored(arrow_l_img, lx, c.y, arrow_l_img.naturalWidth*c.sx, arrow_l_img.naturalHeight*c.sy, (arrow_pressed_ctrl===c.id&&arrow_pressed_side==='left')?c_yellow:c_white, self.text_black_fade);
                if(arrow_r_img?.complete) draw_colored(arrow_r_img, rx, c.y, arrow_r_img.naturalWidth*c.sx, arrow_r_img.naturalHeight*c.sy, (arrow_pressed_ctrl===c.id&&arrow_pressed_side==='right')?c_yellow:c_white, self.text_black_fade);
            } else if(c.id==='reset') {
                const img=get_panel_img_obj(c.img);
                if(img?.complete) draw_colored(img, c.x, c.y, img.naturalWidth*c.sx, img.naturalHeight*c.sy, reset_pending?c_yellow:c_white, self.text_black_fade);
            } else if(c.id==='analogTypeDisp') {
                const subimg=(!settings_layout&&((isStick&&ui_state===3)||(!isStick&&ui_state===4)))?lang+3:lang;
                const img=load_sprite(c.img, subimg);
                if(img?.complete) draw_sprite_ext(img,0,c.x,c.y,c.sx,c.sy,0,c_white,self.text_black_fade);
            } else if(c.img) {
                const img=get_panel_img_obj(c.img);
                if(img?.complete) draw_sprite_ext(img,0,c.x,c.y,c.sx,c.sy,0,c_white,self.text_black_fade);
            }
        }
        ctx.font=`bold 20px ${joystick_font?'MobileFont':'monospace'}`;
        ctx.fillStyle=`rgba(255,255,255,${self.text_black_fade})`;
        ctx.textAlign='center'; ctx.textBaseline='middle';
        for(const c of panel) if(c.val) ctx.fillText(fmt_num(c.val()), c.numX, c.numY);
    }
}

function handleScratchButtons() {
    // scr_button 只负责隐藏编辑器原生 UI，与 GreenFlag_Start 完全独立
    if (!scr_button) return;

    const fullscreenStyleId = 'virt-ctrl-fullscreen-style';
    if (!document.getElementById(fullscreenStyleId)) {
        const style = document.createElement('style');
        style.id = fullscreenStyleId;
        // 只隐藏 Scratch 编辑器/播放器的原生控制栏，绝不碰开始界面
        style.textContent = `
            html, body { margin: 0 !important; padding: 0 !important; overflow: hidden !important; }
            /* 菜单栏 */
            [class*="menu-bar"], .menu-bar, .menu-bar_menu-bar_Jcuqa {
                display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;
                position: absolute !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;
            }
            /* 舞台头部 */
            [class*="stage-header"], .stage-header, .stage-header_stage-header-wrapper_1vxQP {
                display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;
                position: absolute !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;
            }
            /* 控制栏容器（编辑器底部/顶部按钮区） */
            [class*="controls_controls-container"], [class*="tw-controls"], [class*="control-bar"],
            .controls-container, .controls_controls-container_2xinB {
                display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;
                position: absolute !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;
            }
            /* GUI 包装器 */
            .gui-wrapper, [class*="gui-wrapper"], .player-container, [class*="player-container"] {
                display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;
                position: absolute !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;
            }
            /* 暂停按钮、全屏按钮、涡轮指示器 */
            [class*="pause"], .pause-button, [class*="turbo-indicator"], .turbo-indicator,
            [class*="fullscreen"], .fullscreen-button, .fullscreen_fullscreen_1wCen {
                display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;
                position: absolute !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;
            }
            /* 停止按钮 */
            [class*="stop-all"], .stop-all, .stop-all_stop-all_1Y8P9 {
                display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;
                position: absolute !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;
            }
            /* 编辑器绿旗（通过父级限定，绝不误伤开始界面） */
            .controls_controls-container_2xinB [class*="green-flag"],
            .control-bar [class*="green-flag"],
            [class*="controls-container"] [class*="green-flag"] {
                display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important;
                position: absolute !important; width: 0 !important; height: 0 !important; margin: 0 !important; padding: 0 !important; border: none !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 只隐藏编辑器原生 UI，绝不碰开始界面
    function removeNativeUI() {
        const editorSelectors = [
            '.menu-bar', '.menu-bar_menu-bar_Jcuqa',
            '.stage-header', '.stage-header_stage-header-wrapper_1vxQP',
            '.controls-container', '.controls_controls-container_2xinB',
            '.control-bar', '.tw-controls',
            '.gui-wrapper', '.player-container',
            '.pause-button', '.turbo-indicator',
            '.fullscreen-button', '.fullscreen_fullscreen_1wCen',
            '.stop-all', '.stop-all_stop-all_1Y8P9'
        ];
        editorSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => {
                // 严格排除：如果元素在开始界面内，完全不动
                if (el.closest('#launch, .launch-overlay, .start-overlay, [class*="start-overlay"], [class*="splash-screen"]')) return;
                el.style.display = 'none';
                el.style.visibility = 'hidden';
            });
        });

        // 清理舞台包装器边距（排除开始界面）
        const stageWrappers = document.querySelectorAll(
            '.stage-wrapper, [class*="stage-wrapper"]:not([class*="start"]):not([class*="launch"]), ' +
            '.player-stage, [class*="player-stage"]:not([class*="start"]):not([class*="launch"]), ' +
            '#app, .sc-stage, [class*="sc-stage"], .stage_stage-wrapper, [class*="stage_stage"]'
        );
        stageWrappers.forEach(el => {
            if (el.closest('#launch, .launch-overlay, .start-overlay, [class*="start-overlay"]')) return;
            el.style.padding = '0'; el.style.margin = '0'; el.style.border = 'none'; el.style.boxSizing = 'border-box';
        });

        // 清理 canvas 父级边距（遇到开始界面就停止）
        const canvas = find_scratch_canvas();
        if (canvas) {
            let parent = canvas.parentElement;
            while (parent && parent !== document.body) {
                if (parent.closest('#launch, .launch-overlay, .start-overlay, [class*="start-overlay"]')) break;
                parent.style.padding = '0'; parent.style.margin = '0'; parent.style.border = 'none';
                parent = parent.parentElement;
            }
        }
    }

    removeNativeUI();
    // scr_button 绝不碰开始界面，保持原样

    const observer = new MutationObserver(() => {
        removeNativeUI();
        // MutationObserver 也不碰开始界面
        if (!document.getElementById(fullscreenStyleId)) {
            const s = document.createElement('style');
            s.id = fullscreenStyleId;
            s.textContent = document.getElementById(fullscreenStyleId)?.textContent || '';
            document.head.appendChild(s);
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function onResizeFix() {
        removeNativeUI();
        window.dispatchEvent(new Event('resize'));
        update_area();
        draw();
    }
    window.addEventListener('resize', onResizeFix);
    window.addEventListener('orientationchange', onResizeFix);
    document.addEventListener('fullscreenchange', onResizeFix);
    setTimeout(onResizeFix, 100);
    setTimeout(onResizeFix, 500);
    setTimeout(onResizeFix, 1000);
}

// ── GreenFlag_Start 独立管理：自动点击绿旗开始项目 ──
function handleAutoStart() {
    if (!GreenFlag_Start) return;

    function triggerAutoStart() {
        const vm = getVM();
        if (vm) {
            try {
                if (typeof vm.start === 'function') vm.start();
                if (typeof vm.greenFlag === 'function') { vm.greenFlag(); return true; }
                if (vm.runtime && typeof vm.runtime.start === 'function') vm.runtime.start();
                if (vm.runtime && typeof vm.runtime.greenFlag === 'function') { vm.runtime.greenFlag(); return true; }
            } catch(e) {}
        }
        const scaffolding = window.scaffolding;
        if (scaffolding && typeof scaffolding.greenFlag === 'function') {
            try { scaffolding.greenFlag(); return true; } catch(e) {}
        }
        // 兜底：点击开始界面的绿旗
        const startScreen = document.querySelector('#launch, .launch-overlay, .start-overlay, [class*="start-overlay"]');
        if (startScreen) {
            const gf = startScreen.querySelector('.green-flag, [class*="green-flag"], [class*="greenFlag"], button');
            if (gf && typeof gf.click === 'function') { gf.click(); return true; }
        }
        return false;
    }

    // 关闭开始界面（黑幕+绿旗），让项目直接开始
    function closeStartScreen() {
        const overlays = document.querySelectorAll(
            '#launch, .launch-overlay, .loading-overlay, .start-overlay, ' +
            '[class*="launch-overlay"], [class*="loading-overlay"], [class*="start-overlay"], ' +
            '[class*="backdrop"], [class*="overlay-bg"], [class*="splash-screen"]'
        );
        overlays.forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.opacity = '0';
            el.style.pointerEvents = 'none';
        });
    }

    function waitForVmAndStart() {
        const vm = getVM();
        if (vm && vm.runtime) {
            if (!vm._greenFlagHooked) {
                vm._greenFlagHooked = true;
                const _origGreenFlag = vm.greenFlag;
                vm.greenFlag = function() {
                    const result = _origGreenFlag.apply(vm, arguments);
                    // 自动开始时关闭开始界面
                    if (GreenFlag_Start) {
                        setTimeout(closeStartScreen, 50);
                        setTimeout(closeStartScreen, 200);
                    }
                    return result;
                };
            }
            const isRunning = vm.runtime && !vm.runtime.paused && typeof vm.runtime._step === 'function';
            if (!isRunning) {
                triggerAutoStart();
                closeStartScreen();
            }
            if (vm.runtime.on) {
                vm.runtime.on('PROJECT_LOADED', () => {
                    if (GreenFlag_Start) {
                        setTimeout(() => { triggerAutoStart(); closeStartScreen(); }, 100);
                    }
                });
            }
            if (GreenFlag_Start) {
                setTimeout(() => { triggerAutoStart(); closeStartScreen(); }, 300);
                setTimeout(() => { triggerAutoStart(); closeStartScreen(); }, 600);
                setTimeout(() => { triggerAutoStart(); closeStartScreen(); }, 1000);
            }
        } else setTimeout(waitForVmAndStart, 100);
    }
    waitForVmAndStart();
}

// ── 系统键盘按钮绘制 ──
function drawAKB(op) {
    if (!Android_System_Keyboard) return;
    // ★ ui_state=2 在屏幕坐标系下绘制，用转换函数
    let drawX, drawY;
    if (ui_state === 2) {
        const sx = (lx) => (game_area.x + lx * game_area.scale) * dpr;
        const sy = (ly) => (game_area.y + ly * game_area.scale) * dpr;
        drawX = sx(-50);
        drawY = sy(5);
    } else {
        drawX = akb_x;
        drawY = akb_y;
    }
    const spr = keyboard_check(105) ? spr_akb_p : spr_akb_n;
    if(spr?.complete) {
        const drawScale = ui_state === 2 ? 2 * game_area.scale * dpr : 2;
        draw_sprite_ext(spr, 0, drawX, drawY, drawScale, drawScale, 0, c_white, op);
    }
}

function obj_mobilekey_Create_0() {
    return {
        cu:1, cd:1, cl:1, cr:1, cz:1, cx:1, cg:1,
        mk_z:90, mk_x:88, mk_c:67, mk_up:38, mk_down:40, mk_left:37, mk_right:39,
        mk_h: mobile_heal_key,
        mk_f2: mobile_f2_key,
        mk_extra1: button_extra_1_key,
        mk_extra2: button_extra_2_key,
        mk_extra3: button_extra_3_key,
        mk_extra4: button_extra_4_key,
        zCol:c_aqua, xCol:c_orange, cCol:c_green, healCol:c_blue, f2Col:c_red,
        extra1Col:c_yellow, extra2Col:c_purple, extra3Col:c_white, extra4Col:c_gray, alpha:0.85
    };
}
function obj_mobilekey_Step_0(self) {
    let cu=1, cd=1, cl=1, cr=1, cz=1, cx=1, cg=1, ch=1, cf2=1,
        cextra1=1, cextra2=1, cextra3=1, cextra4=1, cakb=1;
    // 第一套键盘固定使用 (-50,5)
    const useAkbX = -50;
    const useAkbY = 5;
    for(let i=0;i<4;i++) {
        if(!device_mouse_check_button(i, mb_left)) continue;
        const gx=device_mouse_x_to_gui(i), gy=device_mouse_y_to_gui(i);
        if (Android_System_Keyboard && gx>=useAkbX && gx<=useAkbX+AKB_W && gy>=useAkbY && gy<=useAkbY+AKB_H) {
            cakb = 0.5; keyboard_key_press(105);
        }
        // ★ 更新按钮触摸检测坐标（匹配新的阶梯布局）
        else if (gx>=830 && gx<=940 && gy>=270 && gy<=360) { cz=0.5; keyboard_key_press(self.mk_z); }
        else if (gx>=720 && gx<=830 && gy>=330 && gy<=420) { cx=0.5; keyboard_key_press(self.mk_x); }
        else if (gx>=610 && gx<=720 && gy>=390 && gy<=480) { cg=0.5; keyboard_key_press(self.mk_c); }
        else if (mobile_f2 && gx>=0 && gx<=80 && gy>=0 && gy<=30) { cf2=0.5; keyboard_key_press(self.mk_f2); }
        else if (button_extra_1 && gx>=0 && gx<=80 && gy>=40 && gy<=70) { cextra1=0.5; keyboard_key_press(self.mk_extra1); }
        else if (button_extra_3 && gx>=90 && gx<=170 && gy>=0 && gy<=30) { cextra3=0.5; keyboard_key_press(self.mk_extra3); }
        else if (mobile_heal && gx>=560 && gx<=640 && gy>=0 && gy<=30) { ch=0.5; keyboard_key_press(self.mk_h); }
        else if (button_extra_2 && gx>=560 && gx<=640 && gy>=40 && gy<=70) { cextra2=0.5; keyboard_key_press(self.mk_extra2); }
        else if (button_extra_4 && gx>=471 && gx<=551 && gy>=0 && gy<=30) { cextra4=0.5; keyboard_key_press(self.mk_extra4); }
        else {
            const da = (Math.atan2(-(gy-410), gx-90)*180/Math.PI + 360) % 360;
            if(da>=292.5||da<=67.5) { cr=0.5; keyboard_key_press(self.mk_right); }
            if(da>=22.5&&da<=157.5) { cu=0.5; keyboard_key_press(self.mk_up); }
            if(da>=112.5&&da<=247.5) { cl=0.5; keyboard_key_press(self.mk_left); }
            if(da>=202.5&&da<=337.5) { cd=0.5; keyboard_key_press(self.mk_down); }
        }
    }
    if (keyboard_check_pressed(105)) _openSystemKeyboard();
    if(cz===1&&keyboard_check(self.mk_z)) keyboard_key_release(self.mk_z);
    if(cx===1&&keyboard_check(self.mk_x)) keyboard_key_release(self.mk_x);
    if(cg===1&&keyboard_check(self.mk_c)) keyboard_key_release(self.mk_c);
    if(ch===1&&keyboard_check(self.mk_h)) keyboard_key_release(self.mk_h);
    if(cf2===1&&keyboard_check(self.mk_f2)) keyboard_key_release(self.mk_f2);
    if(cextra1===1&&keyboard_check(self.mk_extra1)) keyboard_key_release(self.mk_extra1);
    if(cextra2===1&&keyboard_check(self.mk_extra2)) keyboard_key_release(self.mk_extra2);
    if(cextra3===1&&keyboard_check(self.mk_extra3)) keyboard_key_release(self.mk_extra3);
    if(cextra4===1&&keyboard_check(self.mk_extra4)) keyboard_key_release(self.mk_extra4);
    if(cr===1&&keyboard_check(self.mk_right)) keyboard_key_release(self.mk_right);
    if(cu===1&&keyboard_check(self.mk_up)) keyboard_key_release(self.mk_up);
    if(cl===1&&keyboard_check(self.mk_left)) keyboard_key_release(self.mk_left);
    if(cd===1&&keyboard_check(self.mk_down)) keyboard_key_release(self.mk_down);
    if(cakb===1&&keyboard_check(105)) keyboard_key_release(105);
    self.cu=cu; self.cd=cd; self.cl=cl; self.cr=cr; self.cz=cz; self.cx=cx; self.cg=cg;
}
function obj_mobilekey_Draw_75(self) {
    // ★ obj_mobilekey 在屏幕坐标下绘制——把游戏逻辑坐标转换为屏幕物理像素
    const sx = (lx) => (game_area.x + lx * game_area.scale) * dpr;
    const sy = (ly) => (game_area.y + ly * game_area.scale) * dpr;
    
    // ★ 辅助：填充+白色描边的圆角矩形
    function btn(x1,y1,x2,y2,fillCol) {
        draw_roundrect_color(x1,y1,x2,y2, fillCol, fillCol, 0);
        ctx.save();
        ctx.globalAlpha = _draw_alpha;
        ctx.strokeStyle = 'rgba(255,255,255,1)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const lx=Math.min(x1,x2), rx=Math.max(x1,x2), ty=Math.min(y1,y2), by=Math.max(y1,y2);
        const w=rx-lx, h=by-ty, r=Math.min(8,w/2,h/2);
        ctx.moveTo(lx+r,ty); ctx.lineTo(rx-r,ty); ctx.quadraticCurveTo(rx,ty,rx,ty+r);
        ctx.lineTo(rx,by-r); ctx.quadraticCurveTo(rx,by,rx-r,by); ctx.lineTo(lx+r,by);
        ctx.quadraticCurveTo(lx,by,lx,by-r); ctx.lineTo(lx,ty+r); ctx.quadraticCurveTo(lx,ty,lx+r,ty);
        ctx.closePath();
        ctx.stroke();
        // ★ 绘制按钮文字 (Z/X/C)
        ctx.fillStyle = 'rgba(255,255,255,1)';
        ctx.font = 'bold ' + Math.min(w, h) * 0.5 + 'px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn._label || '', (lx+rx)/2, (ty+by)/2);
        ctx.restore();
    }
    
    draw_set_alpha(1);
    
    // ★ 加大按钮 + 阶梯布局（完全避开游戏 FIGHT/ACT/ITEM/MERCY 按钮）
    // Z 按钮 - 青色 (最右上)
    btn._label = 'Z';
    btn(sx(830), sy(270), sx(940), sy(360), gms_col(self.zCol));
    // X 按钮 - 橙色 (中间右上)
    btn._label = 'X';
    btn(sx(720), sy(330), sx(830), sy(420), gms_col(self.xCol));
    // C 按钮 - 绿色 (中间)
    btn._label = 'C';
    btn(sx(610), sy(390), sx(720), sy(480), gms_col(self.cCol));
    
    draw_set_alpha(1);
    drawAKB(1);
    // 左下摇杆背景图
    if(spr_mobilekey?.complete) draw_sprite_ext(spr_mobilekey,0,sx(90),sy(410),2*game_area.scale,2*game_area.scale,0,c_white,1);
}

function obj_mobilecontrols_Create_0() {
    load_vars_from_cfg();
    return {
        edit:0, black_fade:0, text_black_fade:0, active_key:-1,
        settings_pending:false, settings_press_start:0, settings_touch_id:null,
        key_map: {
            z:90, x:88, c:67, up:38, down:40, left:37, right:39,
            h:mobile_heal_key, f2:mobile_f2_key,
            extra1:button_extra_1_key, extra2:button_extra_2_key,
            extra3:button_extra_3_key, extra4:button_extra_4_key
        }
    };
}
function obj_mobilecontrols_Step_0(self) {
    const { sett_touched, sett_just_pressed, sett_touch_id } = getSettingsTouchState();
    settings_down = keyboard_check(92) || sett_touched;
    _createAllVirtualKeys(self); _virtualKeysProcessTouches();
    applyTransition(self);
    handleKeyboardToggle(self, toggle_edit);
    if(!self.edit) {
        if(sett_just_pressed) toggle_edit(self);
        analog_cx=analog_posx+59*analog_scale/2; analog_cy=analog_posy+59*analog_scale/2;
        if(!stick_drag) {
            for(const pid in _pointerDown) {
                if(!_pointerDown[pid]) continue;
                const p=_pointers[pid];
                if(Math.hypot(p.wx-analog_cx, p.wy-analog_cy)<=(59*analog_scale/2+EXTRA_RADIUS_FACTOR*analog_scale)*1.5) {
                    stick_drag=true; stick_touch=pid; drag_stick(p.wx,p.wy); break;
                }
            }
        } else if(_pointerDown[stick_touch]&&_pointers[stick_touch]) drag_stick(_pointers[stick_touch].wx, _pointers[stick_touch].wy);
        else reset_stick();
        if (keyboard_check_pressed(105)) _openSystemKeyboard();
        return;
    }
    processResetButton(true);
    const mx=device_mouse_x_to_gui(0), my=device_mouse_y_to_gui(0), mb=mouse_check_button_pressed(mb_left);
    handleSettingsDelay(self, sett_just_pressed, sett_touch_id, toggle_edit);
    if(self.active_key===-1&&!self.settings_pending) { processArrows(mx,my,mb); processDragStart(self,mx,my,mb,true); }
    processDragMove(self);
}
function toggle_edit(self) { self.edit=!self.edit; audio_play_sound(self.edit?'snd_spearappear_mobile':'snd_egg_mobile'); if(!self.edit) save_vars_to_cfg(); _createAllVirtualKeys(self); }
function reset_all() {
    Object.assign(cfg_all.stick, default_cfg.stick);
    load_vars_from_cfg();
    audio_play_sound('snd_noise_mobile'); save_vars_to_cfg();
}
function obj_mobilecontrols_Draw_75(self) {
    drawPanel(self, true);
    const op=controls_opacity;
    const base=get_joy_base(), stick=get_joy_stick();
    if(base?.complete&&stick?.complete) {
        draw_sprite_ext(base,0,analog_posx,analog_posy,analog_scale,analog_scale,0,c_white,op);
        const sx=analog_cx+stick_off_x-20.5*analog_scale, sy=analog_cy+stick_off_y-20.5*analog_scale;
        draw_sprite_ext(stick,0,sx,sy,analog_scale,analog_scale,0,c_white,op);
    }
    draw_sprite_ext(keyboard_check(self.key_map.z)?btn_z_p:btn_z_n,0,zx,zy,button_scale,button_scale,0,c_white,op);
    draw_sprite_ext(keyboard_check(self.key_map.x)?btn_x_p:btn_x_n,0,xx,xy,button_scale,button_scale,0,c_white,op);
    draw_sprite_ext(keyboard_check(self.key_map.c)?btn_c_p:btn_c_n,0,cx,cy,button_scale,button_scale,0,c_white,op);
    if (mobile_heal) {
        const spr = keyboard_check(self.key_map.h) ? get_sprite(mobile_heal_spr, 1) : get_sprite(mobile_heal_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,heal_x,heal_y,button_scale,button_scale,0,c_white,op);
    }
    if (mobile_f2) {
        const spr = keyboard_check(self.key_map.f2) ? get_sprite(mobile_f2_spr, 1) : get_sprite(mobile_f2_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,f2_x,f2_y,button_scale,button_scale,0,c_white,op);
    }
    if (button_extra_1) {
        const spr = keyboard_check(self.key_map.extra1) ? get_sprite(button_extra_1_spr, 1) : get_sprite(button_extra_1_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,extra1_x,extra1_y,button_scale,button_scale,0,c_white,op);
    }
    if (button_extra_2) {
        const spr = keyboard_check(self.key_map.extra2) ? get_sprite(button_extra_2_spr, 1) : get_sprite(button_extra_2_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,extra2_x,extra2_y,button_scale,button_scale,0,c_white,op);
    }
    if (button_extra_3) {
        const spr = keyboard_check(self.key_map.extra3) ? get_sprite(button_extra_3_spr, 1) : get_sprite(button_extra_3_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,extra3_x,extra3_y,button_scale,button_scale,0,c_white,op);
    }
    if (button_extra_4) {
        const spr = keyboard_check(self.key_map.extra4) ? get_sprite(button_extra_4_spr, 1) : get_sprite(button_extra_4_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,extra4_x,extra4_y,button_scale,button_scale,0,c_white,op);
    }
    drawAKB(op);
    const si=get_settings_img(settings_down);
    if(si?.complete) draw_sprite_ext(si,0,settx,setty,SETT_SCALE,SETT_SCALE,0,c_white,0.5);
}
function obj_mobilecontrols_CleanUp_0(self) { if(self.edit) save_vars_to_cfg(); _vkList.length=0; }

function obj_mobilecontrols_button_Create_0() {
    load_vars_from_cfg();
    return {
        edit:0, black_fade:0, text_black_fade:0, active_key:-1,
        settings_pending:false, settings_press_start:0, settings_touch_id:null,
        key_map: {
            z:90, x:88, c:67, up:38, down:40, left:37, right:39,
            h:mobile_heal_key, f2:mobile_f2_key,
            extra1:button_extra_1_key, extra2:button_extra_2_key,
            extra3:button_extra_3_key, extra4:button_extra_4_key
        }
    };
}
function obj_mobilecontrols_button_Step_0(self) {
    const { sett_touched, sett_just_pressed, sett_touch_id } = getSettingsTouchState();
    settings_down = keyboard_check(92) || sett_touched;
    _createAllVirtualKeys(self); _virtualKeysProcessTouches();
    applyTransition(self);
    handleKeyboardToggle(self, toggle_edit);
    if(!self.edit) {
        if(sett_just_pressed) toggle_edit(self);
        if (keyboard_check_pressed(105)) _openSystemKeyboard();
        return;
    }
    processResetButton(false);
    const mx=device_mouse_x_to_gui(0), my=device_mouse_y_to_gui(0), mb=mouse_check_button_pressed(mb_left);
    handleSettingsDelay(self, sett_just_pressed, sett_touch_id, toggle_edit);
    if(self.active_key===-1&&!self.settings_pending) { processArrows(mx,my,mb); processDragStart(self,mx,my,mb,false); }
    processDragMove(self);
}
function reset_all_button() {
    const def = (joystick_type === 0) ? default_cfg.dpad.style0 : default_cfg.dpad.style1;
    controls_opacity = def.controls_opacity; button_scale = def.button_scale; analog_scale = def.analog_scale; joystick_type = def.joystick_type;
    zx = def.zx; zy = def.zy; xx = def.xx; xy = def.xy; cx = def.cx; cy = def.cy;
    settx = def.settx; setty = def.setty;
    upx = def.upx; upy = def.upy; downx = def.downx; downy = def.downy;
    leftx = def.leftx; lefty = def.lefty; rightx = def.rightx; righty = def.righty;
    heal_x = def.heal_x; heal_y = def.heal_y; f2_x = def.f2_x; f2_y = def.f2_y;
    extra1_x = def.extra1_x; extra1_y = def.extra1_y;
    extra2_x = def.extra2_x; extra2_y = def.extra2_y;
    extra3_x = def.extra3_x; extra3_y = def.extra3_y;
    extra4_x = def.extra4_x; extra4_y = def.extra4_y;
    akb_x = def.akb_x; akb_y = def.akb_y;  // ★ 重置系统键盘按钮坐标
    cfg_all.dpad.current_style = joystick_type;
    Object.assign(cfg_all.dpad[`style${joystick_type}`], def);
    save_cfg_all();
    audio_play_sound('snd_noise_mobile');
}
function obj_mobilecontrols_button_Draw_75(self) {
    drawPanel(self, false);
    const op=controls_opacity;
    draw_sprite_ext(keyboard_check(self.key_map.z)?btn_z_p:btn_z_n,0,zx,zy,button_scale,button_scale,0,c_white,op);
    draw_sprite_ext(keyboard_check(self.key_map.x)?btn_x_p:btn_x_n,0,xx,xy,button_scale,button_scale,0,c_white,op);
    draw_sprite_ext(keyboard_check(self.key_map.c)?btn_c_p:btn_c_n,0,cx,cy,button_scale,button_scale,0,c_white,op);
    if (mobile_heal) {
        const spr = keyboard_check(self.key_map.h) ? get_sprite(mobile_heal_spr, 1) : get_sprite(mobile_heal_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,heal_x,heal_y,button_scale,button_scale,0,c_white,op);
    }
    if (mobile_f2) {
        const spr = keyboard_check(self.key_map.f2) ? get_sprite(mobile_f2_spr, 1) : get_sprite(mobile_f2_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,f2_x,f2_y,button_scale,button_scale,0,c_white,op);
    }
    if (button_extra_1) {
        const spr = keyboard_check(self.key_map.extra1) ? get_sprite(button_extra_1_spr, 1) : get_sprite(button_extra_1_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,extra1_x,extra1_y,button_scale,button_scale,0,c_white,op);
    }
    if (button_extra_2) {
        const spr = keyboard_check(self.key_map.extra2) ? get_sprite(button_extra_2_spr, 1) : get_sprite(button_extra_2_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,extra2_x,extra2_y,button_scale,button_scale,0,c_white,op);
    }
    if (button_extra_3) {
        const spr = keyboard_check(self.key_map.extra3) ? get_sprite(button_extra_3_spr, 1) : get_sprite(button_extra_3_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,extra3_x,extra3_y,button_scale,button_scale,0,c_white,op);
    }
    if (button_extra_4) {
        const spr = keyboard_check(self.key_map.extra4) ? get_sprite(button_extra_4_spr, 1) : get_sprite(button_extra_4_spr, 0);
        if(spr?.complete) draw_sprite_ext(spr,0,extra4_x,extra4_y,button_scale,button_scale,0,c_white,op);
    }
    drawAKB(op);
    draw_sprite_ext(keyboard_check(self.key_map.up)?dir_up_p:dir_up_n,0,upx,upy,analog_scale,analog_scale,0,c_white,op);
    draw_sprite_ext(keyboard_check(self.key_map.left)?dir_left_p:dir_left_n,0,leftx,lefty,analog_scale,analog_scale,0,c_white,op);
    draw_sprite_ext(keyboard_check(self.key_map.down)?dir_down_p:dir_down_n,0,downx,downy,analog_scale,analog_scale,0,c_white,op);
    draw_sprite_ext(keyboard_check(self.key_map.right)?dir_right_p:dir_right_n,0,rightx,righty,analog_scale,analog_scale,0,c_white,op);
    const si=get_settings_img(settings_down);
    if(si?.complete) draw_sprite_ext(si,0,settx,setty,SETT_SCALE,SETT_SCALE,0,c_white,0.5);
}
function obj_mobilecontrols_button_CleanUp_0(self) { if(self.edit) save_vars_to_cfg(); _vkList.length=0; }

function toggle_keyboard() {
    // 切换键盘前，若系统键盘处于激活状态，则先关闭它
    if (system_kb_active) {
        _closeSystemKeyboard();
        // 强制重置状态，防止残留
        system_kb_active = false;
        _kb_multi = false;
        _kb_buf = '';
    }
    if (!keyboard_ready || !stage_ready || !system_ready) return;
    if(instances.obj_mobilecontrols?.edit) { save_vars_to_cfg(); instances.obj_mobilecontrols.edit=0; }
    if(instances.obj_mobilecontrols_button?.edit) { save_vars_to_cfg(); instances.obj_mobilecontrols_button.edit=0; }
    _vkList.length=0;
    if(ui_state===1) { ui_state=2; audio_play_sound('snd_save_sup'); instance_create_depth(0,0,0,'obj_mobilekey'); }
    else if(ui_state===2) { ui_state=3; audio_play_sound('snd_mercyadd_mobile'); instance_destroy('obj_mobilekey'); instance_create_depth(0,0,0,'obj_mobilecontrols'); load_vars_from_cfg(); }
    else if(ui_state===3) { ui_state=4; audio_play_sound('snd_noise_mobile'); instance_destroy('obj_mobilecontrols'); instance_create_depth(0,0,0,'obj_mobilecontrols_button'); load_vars_from_cfg(); }
    else { ui_state=1; audio_play_sound('snd_item_equip_mobile'); instance_destroy('obj_mobilecontrols_button'); }
    localStorage.setItem('ui_state', ui_state);
    draw();
}

// 【修复2】系统键盘激活时的 Backspace/Escape 处理：
//   - 来自隐藏输入框的 Backspace（虚拟键盘删除键）→ 完全放行，正常删除文本，不关键盘
//   - 来自其他源的 Backspace/Escape（物理按键）→ 关闭系统键盘
//   - 系统键盘未激活时 → 正常切换键盘
document.addEventListener('keydown', e => {
    if (system_kb_active && (e.key === 'Backspace' || e.key === 'Escape')) {
        // 如果 Backspace 事件来自隐藏输入框自身，说明是虚拟键盘的删除键
        // 放行让浏览器正常处理删除，不做任何拦截
        if (e.key === 'Backspace' && e.target === _hidden_input) {
            return;
        }
        // 否则是物理按键（或 Escape），关闭系统键盘并切换布局
        e.preventDefault();
        toggle_keyboard();
        return;
    }
    // 正常键盘切换逻辑（此时系统键盘未激活）
    if (e.key === 'Backspace' || e.key === 'Escape') {
        e.preventDefault();
        toggle_keyboard();
    } else if (mobile_f2 && (e.key === 'F2' || e.keyCode === mobile_f2_key)) {
        e.preventDefault();
        restart_project();
    }
    // 物理回车键触发多键缓冲区发送
    if (system_kb_active && e.key === 'Enter') {
        e.preventDefault();
        if (_kb_multi && _kb_buf) _flushBuf();
        _emit('Enter');
    }
});

// ── 修复后的触摸事件处理（只拦截虚拟按键上的触摸，不碰游戏） ──
function on_touch_start(e) {
    if (ui_state === 1) return;
    ensure_canvas_alive();
    let handledAny = false;
    for (const t of e.changedTouches) {
        // 只处理落在虚拟按键上的触摸点，其他的完全放行给游戏
        if (is_touch_on_controls(t.clientX, t.clientY)) {
            try {
                const {x, y} = world_xy(t.clientX, t.clientY);
                _pointerDown[t.identifier] = true;
                _pointers[t.identifier] = {wx:x, wy:y, justPressed:true};
                handledAny = true;
            } catch(err) {}
        }
    }
    if (handledAny) _updatePointerSlots();
    // 不调用 e.preventDefault()，让不在虚拟按键上的触摸点正常触发游戏的点击/触摸
}
function on_touch_move(e) {
    if (ui_state === 1) return;
    let handledAny = false;
    for (const t of e.changedTouches) {
        // 只更新我们跟踪的触摸点（在虚拟按键上的）
        if (_pointers[t.identifier]) {
            try {
                const {x, y} = world_xy(t.clientX, t.clientY);
                _pointers[t.identifier].wx = x;
                _pointers[t.identifier].wy = y;
                handledAny = true;
            } catch(err) {}
        }
    }
    if (handledAny) _updatePointerSlots();
    // 不阻止默认行为，让游戏能正常接收触摸移动
}
function on_touch_end(e) {
    if (ui_state === 1) return;
    let handledAny = false;
    for (const t of e.changedTouches) {
        // 只清理我们跟踪的触摸点
        if (_pointers[t.identifier]) {
            delete _pointerDown[t.identifier];
            delete _pointers[t.identifier];
            handledAny = true;
        }
    }
    if (handledAny) {
        _updatePointerSlots();
        try { if (ui_state === 3 && stick_drag && stick_touch && !_pointerDown[stick_touch]) reset_stick(); } catch(err) {}
        stopArrowLongpress(); arrow_pressed_ctrl = null; arrow_pressed_side = null;
    }
    // 不阻止默认行为，让游戏能正常接收触摸结束
}
function on_touch_cancel(e) { on_touch_end(e); }

// ── 鼠标事件处理（镜像触控逻辑） ──
const MOUSE_ID = 'mouse';

function on_mouse_down(e) {
    if (ui_state === 1) return;
    if (e.button !== 0) return; // 只处理左键
    ensure_canvas_alive();
    if (!is_touch_on_controls(e.clientX, e.clientY)) return;
    try {
        const {x, y} = world_xy(e.clientX, e.clientY);
        _pointerDown[MOUSE_ID] = true;
        _pointers[MOUSE_ID] = {wx: x, wy: y, justPressed: true};
        _updatePointerSlots();
    } catch(err) {}
}

function on_mouse_move(e) {
    if (ui_state === 1) return;
    if (!_pointerDown[MOUSE_ID]) return;
    try {
        const {x, y} = world_xy(e.clientX, e.clientY);
        if (_pointers[MOUSE_ID]) {
            _pointers[MOUSE_ID].wx = x;
            _pointers[MOUSE_ID].wy = y;
            _updatePointerSlots();
        }
    } catch(err) {}
}

function on_mouse_up(e) {
    if (ui_state === 1) return;
    if (e.button !== 0) return;
    if (!_pointers[MOUSE_ID]) return;
    delete _pointerDown[MOUSE_ID];
    delete _pointers[MOUSE_ID];
    _updatePointerSlots();
    try { if (ui_state === 3 && stick_drag && stick_touch === MOUSE_ID) reset_stick(); } catch(err) {}
    stopArrowLongpress(); arrow_pressed_ctrl = null; arrow_pressed_side = null;
}

function on_mouse_leave(e) {
    // 鼠标离开页面时释放所有鼠标持有的控制
    if (!_pointerDown[MOUSE_ID]) return;
    delete _pointerDown[MOUSE_ID];
    delete _pointers[MOUSE_ID];
    _updatePointerSlots();
    try { if (ui_state === 3 && stick_drag && stick_touch === MOUSE_ID) reset_stick(); } catch(err) {}
    stopArrowLongpress(); arrow_pressed_ctrl = null; arrow_pressed_side = null;
}

// 使用 capture: false，让事件先到达游戏，键盘只处理属于自己的部分
document.addEventListener('touchstart', on_touch_start, {passive: true, capture: false});
document.addEventListener('touchmove', on_touch_move, {passive: true, capture: false});
document.addEventListener('touchend', on_touch_end, {passive: true, capture: false});
document.addEventListener('touchcancel', on_touch_cancel, {passive: true, capture: false});
document.addEventListener('mousedown', on_mouse_down, {passive: true, capture: false});
document.addEventListener('mousemove', on_mouse_move, {passive: true, capture: false});
document.addEventListener('mouseup', on_mouse_up, {passive: true, capture: false});
document.addEventListener('mouseleave', on_mouse_leave, {passive: true, capture: false});

// ── 游戏循环（受 stage_ready 与 keyboard_ready 双重保护） ──
function game_loop() {
    ensure_canvas_alive();
    update_area();

    // 页面在后台时：如果系统键盘还开着，强制关闭
    if (document.hidden && system_kb_active) {
        _closeSystemKeyboard();
    }

    // ★ 更新调试状态
    if (window.__mc) {
        window.__mc.loop_calls++;
        window.__mc.game_area = game_area;
    }

    // 舞台或贴图未就绪时，只维持自身存活，不执行任何键盘逻辑
    if (!stage_ready || !keyboard_ready) {
        requestAnimationFrame(game_loop);
        return;
    }

    _keyboardBeginStep();
    if (ui_state === 2 && instances.obj_mobilekey) obj_mobilekey_Step_0(instances.obj_mobilekey);
    else if (ui_state === 3 && instances.obj_mobilecontrols) obj_mobilecontrols_Step_0(instances.obj_mobilecontrols);
    else if (ui_state === 4 && instances.obj_mobilecontrols_button) obj_mobilecontrols_button_Step_0(instances.obj_mobilecontrols_button);
    draw();
    for (const id in _pointers) if (_pointers[id]) _pointers[id].justPressed = false;
    requestAnimationFrame(game_loop);
}

function draw() {
    ensure_canvas_alive();
    if (!ctx || !game_area.scale || !keyboard_ready) {
        return;
    }
    // ★ 调试计数
    if (window.__mc) window.__mc.draw_calls++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (ui_state === 1) return;
    ctx.save();
    ctx.translate(game_area.x * dpr, game_area.y * dpr);
    ctx.scale(game_area.scale * dpr, game_area.scale * dpr);
    ctx.imageSmoothingEnabled = false;
    if (ui_state === 2 && instances.obj_mobilekey) {
        // ★ obj_mobilekey 用屏幕坐标绘制——绕过 game_area.scale 缩小
        ctx.restore();
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        obj_mobilekey_Draw_75(instances.obj_mobilekey);
        ctx.restore();
    }
    else if (ui_state === 3 && instances.obj_mobilecontrols) obj_mobilecontrols_Draw_75(instances.obj_mobilecontrols);
    else if (ui_state === 4 && instances.obj_mobilecontrols_button) obj_mobilecontrols_button_Draw_75(instances.obj_mobilecontrols_button);
    ctx.restore();
}

// ── 增强的 VM 获取（兼容旧版） ──
let _cachedVM = null;
function getVM() {
    if (_cachedVM) return _cachedVM;

    // 1. 常规路径
    if (window.vm) { _cachedVM = window.vm; return _cachedVM; }
    if (window.scaffolding && window.scaffolding.vm) { _cachedVM = window.scaffolding.vm; return _cachedVM; }
    if (window.scratchVM) { _cachedVM = window.scratchVM; return _cachedVM; }
    if (window.ScratchVM) { _cachedVM = window.ScratchVM; return _cachedVM; }

    // 2. 暴力扫描所有全局变量
    for (const key in window) {
        try {
            const obj = window[key];
            if (obj && typeof obj === 'object') {
                if (typeof obj.greenFlag === 'function' && obj.runtime && typeof obj.runtime === 'object') {
                    _cachedVM = obj;
                    return _cachedVM;
                }
                if (obj.vm && typeof obj.vm.greenFlag === 'function') {
                    _cachedVM = obj.vm;
                    return _cachedVM;
                }
            }
        } catch(e) {}
    }

    // 3. 通过 canvas 的 React Fiber 查找
    const sc = find_scratch_canvas();
    if (sc) {
        const reactKey = Object.keys(sc).find(k => k.startsWith('__reactInternalInstance') || k.startsWith('__reactFiber'));
        if (reactKey) {
            let fiber = sc[reactKey];
            for (let i = 0; i < 50 && fiber; i++) {
                if (fiber.memoizedProps?.vm) { _cachedVM = fiber.memoizedProps.vm; return _cachedVM; }
                if (fiber.return?.memoizedProps?.vm) { _cachedVM = fiber.return.memoizedProps.vm; return _cachedVM; }
                if (fiber.stateNode?.props?.vm) { _cachedVM = fiber.stateNode.props.vm; return _cachedVM; }
                fiber = fiber.return;
            }
        }
        if (sc.vm) { _cachedVM = sc.vm; return _cachedVM; }
        if (sc.scratchVM) { _cachedVM = sc.scratchVM; return _cachedVM; }
    }

    return null;
}

// ── 初始化 ──
function init() {
    try {
        load_cfg_all();
        ensure_canvas_alive();

        window.addEventListener('resize', () => { update_area(); draw(); });
        document.addEventListener('visibilitychange', function() {
            handle_visibility();
            if (document.hidden && system_kb_active) {
                _closeSystemKeyboard();
            }
        });
        try { document.addEventListener('pause', freeze_runtime, false); } catch(e) {}
        try { document.addEventListener('resume', unfreeze_runtime, false); } catch(e) {}

        handleScratchButtons();
        handleAutoStart();
        preloadAllNeededSounds();

        setInterval(scheduleCanvasCheck, 2000);

        let initAttempts = 0;
        const maxAttempts = 50;

        function tryInitKeyboard() {
            try {
                console.log('[MC] tryInitKeyboard called, ui_state=' + ui_state);
                stage_ready = true;
                keyboard_ready = true;
                system_ready = true;
                if (ui_state !== 1) {
                    if (ui_state === 2) instance_create_depth(0,0,0,'obj_mobilekey');
                    else if (ui_state === 3) { instance_create_depth(0,0,0,'obj_mobilecontrols'); load_vars_from_cfg(); }
                    else if (ui_state === 4) { instance_create_depth(0,0,0,'obj_mobilecontrols_button'); load_vars_from_cfg(); }
                }
                window.__mc = {
                    ui_state: ui_state,
                    stage_ready: stage_ready,
                    keyboard_ready: keyboard_ready,
                    system_ready: system_ready,
                    instances: instances,
                    game_area: null,
                    loop_calls: 0,
                    draw_calls: 0
                };
                console.log('[MC] __mc created, starting game_loop');
                game_loop();
            } catch(e) {
                console.error('[MC] tryInitKeyboard error:', e.message, e.stack);
            }
        }
        tryInitKeyboard();
    } catch(e) {
        console.error('[MC] init error:', e.message, e.stack);
    }
}
console.log('[MC] IIFE executed, readyState=' + document.readyState);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
})();