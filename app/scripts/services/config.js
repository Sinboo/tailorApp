'use strict';

void function () {
    var app = angular.module('tailorApp');

    var gramWeight = function () {
      var num = 110;
      var gram_weight = {};
      gram_weight['100克及以下'] = 100;
      while(num <= 600) {
        var key = num + '克左右';
        gram_weight[key] = num;
        num = num + 10;
      }
      gram_weight['600克以上'] = 650;
      return gram_weight;
    };

    var GRAMWEIGHT = gramWeight();

    var config = {
        GLOBAL_CONFIG: {
            NAME: '我是裁缝',
            DEBUG: true
        },
        PAGE_SIZE: 20,
        SHOP_TYPE: {
          BRAND: '成衣品牌定制部',
          STORE: '定制店',
          CHAIN: '连锁品牌',
          OTHER: '其他'
        },
        CUSTOMCLOTHING_TYPE: {
          SUIT: '西服', SHIRT: '衬衫', TROUSER: '西裤、休闲裤', OVERCOAT: '大衣', JACKET: '夹克', JEANS: '牛仔裤', CASHMERE: '羊绒衫',
          DOWNJACKET: '羽绒服', WEDDING: '婚纱礼服', CHINESE: '旗袍、中式服装', T_SHIRT: 'T恤、POLO衫、卫衣等', COSTUMES: '演出服', OTHER: '其他'
        },
        SALES_STATUS: {
          NORMAL: '正常',
          OOS: '缺货',
          HALT: '已注销'
        },
        APPLY_STATUS: {
          HELLO: '未处理',
          ACCEPTANT: '通过',
          REFUSED: '拒绝'
        },
        FABRIC_TYPE: {
          GYJ: '国产羊毛精纺',
          GYD: '国产羊毛大衣',
          JYJ: '进口羊毛精纺',
          JYD: '进口羊毛大衣',
          JM: '进口棉面料',
          GM: '国产纯棉、棉涤类',
          GY: '国产亚麻',
          JY: '进口亚麻',
          GQ: '国产其他类型面料',
          JQ: '进口其他类型面料'
        },
        FACTORY_TYPE: {
          SUIT: '西服大衣裤子加工', SHIRT: '衬衫加工', JACKET: '夹克加工', CASHMERE: '羊绒衫加工',
          DOWNJACKET: '羽绒服加工', TEE: 'T恤衫加工', POLO: 'Polo衫加工', OTHER: '其他'
        },
        ACCESSORY_TYPE: {
          TIE: '领带', SILKSCARVES: '丝巾', BUTTON: '扣子', SEWINGTHREAD: '缝纫线',
          LINING: '衬布、里布等辅料', NEEDLES: '机针', OTHER: '其他'
        },
        tailoringTypes: {
          'A,B': '西服套装2ps(A+B)',
          'A,B,C': '西服套装3ps(A+B+C)',
          'A,B,B': '西服套装（A+2B）',
          'A,C': '套装（A+C）',
          'B,C': '套装（B+C）',
          'A': '上衣A',
          'B': '裤子B',
          'C': '马甲C',
          'E': '大衣E',
          'D': '衬衫D',
          'G': '礼服G',
          'F': '夹克F'
        },
        CLOTHING_TYPE: {
          '西服套装2ps(A+B)': ['A', 'B'],
          '西服套装3ps(A+B+C)': ['A', 'B', 'C'],
          '西服套装（A+2B）': ['A', 'B', 'B'],
          '套装（A+C）': ['A', 'C'],
          '套装（B+C）': ['B', 'C'],
          '上衣A': ['A'],
          '裤子B': ['B'],
          '马甲C': ['C'],
          '大衣E': ['E'],
          '衬衫D': ['D'],
          '礼服G': ['G'],
          '夹克F': ['F']
        },
        CLOTHING_TOBUY: {
          A: '西服等未采购',
          D: '衬衫未采购',
          OTHER: '其他未采购'
        },
        SETTLEMENT_TYPE: {
          CASH: '现款支付',
          HALF_MONTH: '半月结',
          MONTH: '月结'
        },
        FACTORY_SETTLEMENT_TYPE: {
          CASH: '现款支付',
          ADVANCE : '预付款',
          MONTH: '月结'
        },
        ORIGIN_PLACE: [
          '意大利',
          '英国',
          '泰国',
          '法国',
          '中国',
          '土耳其'
        ],
        BREADTH: [
          '148~150cm',
          '140cm',
          '130cm',
          '128cm',
          '120cm',
          '115cm',
          '110cm',
          '90cm'
        ],
        FABRIC_COLOR: [
          '藏蓝', '浅灰色', '深灰色', '黑色', '藏青色', '蓝色', '白色', '玫红',
          '红色', '绿色', '紫色', '粉色', '蓝灰', '宝蓝', '草绿', '深绿',
          '咖啡色', '浅咖啡', '墨绿', '暗紫色', '砖红', '酒红', '桃红', '天蓝',
          '黄色', '米色', '棕色', '褐色', '米黄', '橙色', '卡其色',
          '白底蓝条', '白底红条', '白底紫条', '白底黑条', '白底绿条', '白底灰条', '蓝底白条',
          '紫底白条', '白底蓝格', '白底红格', '白底黑格', '白底绿格', '白底紫格',
          '中灰色', '黑灰色', '紫罗兰', '群青色', '中蓝色', '深蓝色', '军绿色', '黄绿色',
          '蓝绿色', '淡黄色', '中黄色', '桔黄色', '朱红色', '橘红色', '深咖色', '其他'
        ],
        EXPRESS_COM: [
          '顺丰', '申通', 'EMS', '全峰', '圆通', '中通', '宅急送',
          '韵达', '优速', '天天', '如风达', '邮政平邮',
          '百世汇通', '德邦物流', '联邦快递', '客户自取', '合包'
        ],
        EXPRESS: {
          '顺丰': 'SF', '申通': 'STO', 'EMS': 'EMS', '全峰': 'QFKD', '圆通': 'YTO',
          '中通': 'ZTO', '宅急送': 'ZJS', '韵达': 'YD', '优速': 'UC', '天天': 'HHTT',
          '如风达': 'RFD', '邮政平邮': 'YZPY', '百世汇通': 'HTKY', '德邦物流': 'DBL',
          '联邦快递': 'FEDEX', '客户自取': 'BYSELF', '合包': 'TOGETHER'
        },
        FLOWER_PATTERN: [
          '纯色', '窄竖条纹', '宽竖条纹', '人字纹', '格子', '宽格',
          '细格', '细条纹', '鸟眼', '斜纹', '暗条纹', '横条纹', '灯芯绒',
          '千鸟格', '提花', '针点', '法兰绒', '网纹', '其他'
        ],
        YARN_COUNT: [
          '40支', '50支', '60支', '70支', '80支', '80支双股', '90支', '100支', '100支双股',
          '110支', '110支双股', '120支', '120支双股', '130支', '140支', '140支双股', '150支',
          '160支', '160支双股', '170支', '170支双股', '180支', '200支', '200支双股', '240支双股',
          '290支', '300支', '300支双股', '其他'
        ],
        COMPOSITION: [
          '纯毛', '95%毛5%涤', '90%毛10%羊绒', '70%毛30%羊绒', '50%毛50%羊绒',
          '70% 聚酯纤维 30% 醋酸', '99%棉1%弹力', '75%棉25%莫代尔', '55%醋酸45%粘胶',
          '65%棉32%黏胶 3%弹力', '75 %黏胶 25%羊毛', '52 %醋酸 36%羊毛 12聚酯纤维',
          '60%羊毛40 %醋酸', '55%粘胶45%羊毛', '60%羊毛40 聚酯纤维', '60 %羊毛40%真丝',
          ' 88%粘胶12%羊毛', '80%羊毛20%真丝', '95%羊毛5%山羊绒', '98%羊毛2%山羊绒',
          '70%羊毛30%马海毛', '棉+莱卡',
          '70%毛', '毛绒丝', '50%W', '30%SE', '纯羊绒',
          '20%LI', '50%W, 30%SE, 20%LI', '50%羊毛(毛涤类)', '84%W 16%WM',
          '30%羊毛', '80%羊毛', 'T/R', '亚麻', '纯棉', '棉丝', '棉涤', '棉麻', '棉毛',
          '涤棉', '真丝', '羊毛羊绒', '羊绒', '棉锦弹力', '80%棉左右+锦纶+弹性纤维', '90%丝 +弹性纤维',
          '羊毛粘胶', '84%毛，16%WM(马海毛)', '其他'
        ],
        GRAM_WEIGHT: GRAMWEIGHT,
        CRAFT: ['半毛衬', '全毛衬', '粘合衬', '全手工', '标准', '精工艺', '手工'],
        ORDER_STATUS: {
          PLACED: '已下单，未付款，等待确认运费信息',
          EXPRESSFEE_CONFIRMED: '确认运费等待付款',
          PAYED: '待发货',
          DELIVERED: '已发货',
          SUCCESS: '交易成功'
        },
        ORDER_MANAGE: {
          DELIVERED: '已发货',
          SUCCESS: '确认收货,交易成功'
        },
        STORAGE_STATUS:{
          INIT: '未入库',
          IN: '已入库未通知',
          INNOTI: '已入库已通知',
          OUT: '  已出库'
        },
        PRODUCE_STATUS: {
          READY: '未下单',
          PLACED: '生产中',
          DELIVERED: '已完成'
        },
        PROVIDER_TYPE: {
          factory: '工厂',
          fabric: '面料商',
          accessory: '辅料商'
        },
        FABRIC_UNIT: {
          METER: '米',
          YARD: '码'
        },
        CURRENCY: {
          CNY: '人民币元',
          HKD: '港元',
          SGD: '新加坡元'
        },
        customShop_OrderType : {
          PLACED: '待确认运费',
          EXPRESSFEE_CONFIRMED: '确认运费待付款',
          PAYED: '已付款待发货',
          DELIVERED: '待确认收货',
          SUCCESS: '已确认收货'
        },
        PRIVILEGE: {
          DELIVER: '发货权限',
          IN: '确认面料到厂',
          PARTNER: '确认业务合作关系',
          PRODUCE: '下单分配'
        },
        FABRIC_RECEIVE_STATUS: {
          DELIVERED: '待收货',
          SUCCESS: '已收货'
        }




    };

    angular.forEach(config, function (key, value) {
        app.constant(value, key);
    });
}();























