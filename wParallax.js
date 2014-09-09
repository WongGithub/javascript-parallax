/**
 * wParallax
 * Ver 0.0.1
 * Dev Mr.Wong
 *
 * 使用示例：
 *
 * <span class="phone" data-startx="95" data-starty="770" data-stopx="95" data-stopy="570" data-startTiming="0" data-stopTiming="150" data-effect="fadein" data-sceneStartTiming="0" data-sceneDuration="1s"></span>
 *
 * data-startx 元件初始X轴位置
 * data-starty 元件初始Y轴位置
 * data-stopx  元件运动终点X轴位置
 * data-stopy  元件运动终点y轴位置
 *
 * data-startTiming 元件开始动画的scroll点 （scene模式下可以不用设置）
 * data-stopTiming  元件结束动画的scroll点 （scene模式下可以不用设置）
 *
 * data-effect 元件动画效果 fadein（渐显） || fadeout （渐隐）
 *
 * data-sceneStartTiming  元件开始场景动画的scroll点 （仅在scene模式下有效）
 * data-sceneDuration  元件动画的时间长度（仅在scene模式下有效）
 */

;(function (D, W, P) {

    var
        //获取dom，并绑定相关方法
        W$ = (function () {
            var dom, w$, prefix;
            //wparallax选择器模块,不完善
            dom = function (argument) {
                if (D.querySelectorAll) {
                    var _dom = D.querySelectorAll(argument);
                    return _dom;
                } else{
                    var arg_array = argument.split(' '),
                        parent = [D],
                        result = [];

                    for(var i= 0,len=arg_array.length;i<len;i++){
                        parent = queryDom(arg_array[i],parent);
                        result = parent;
                    }

                    function queryDom(domstr,parent){
                        var i = 0,
                            len = parent.length,
                            result = [];

                        for (; i < len; i++) {
                            if (domstr.indexOf('#') == 0) {
                                var str = domstr.replace('#', '');
                                result.push(parent[i].getElementById(str));
                            }
                            if (domstr.indexOf('.') == 0) {
                                var str = domstr.replace('.', ''),
                                    HTMLCollection = parent[i].getElementsByClassName(str);
                                for(var _i = 0,_len =HTMLCollection.length;_i<_len;_i++){

                                    result.push(HTMLCollection[_i]);
                                }
                            }
                            if (domstr.indexOf('.') == -1 && domstr.indexOf('#') == -1) {
                                var str = domstr,
                                    HTMLCollection  = parent[i].getElementsByTagName(str);
                                for(var _i = 0,_len =HTMLCollection.length;_i<_len;_i++){
                                    result.push(HTMLCollection[_i]);
                                }
                            }
                        }
                        return result;
                    }

                    return result;
                }
            };
            w$ = function (argument) {
                var _dom = dom(argument) || [];
                _dom.__proto__ = w$.fn;
                return _dom;
            };
            //兼容前缀补丁方法
            prefix = (function () {
                var style = D.createElement('div').style,
                    prefixs = ['t', 'webkitT', 'mozT', 'msT'];
                for (var i = 0, len = prefixs.length; i < len; i++) {
                    var at = prefixs[i] + 'ransform';
                    if (at in style) {
                        var pf = prefixs[i].substr(0, prefixs[i].length - 1);
                        return pf ? '-' + pf + '-' : '';
                    }
                }
            })();
            //绑定相关方法
            w$.fn = {
                //获取data自定义属性的方法
                data: function (key, value) {
                    if (value) {
                        var i = 0,
                            len = this.length;
                        for (; i < len; i++) {
                            this[i].setAttribute('data-' + key, value);
                        }
                        return this;
                    } else {
                        var i = 0,
                            len = this.length,
                            valueArray = [];
                        for (; i < len; i++) {
                            valueArray.push(this[i].getAttribute('data-' + key) || '');
                        }
                        if (valueArray.length > 1) {
                            return valueArray;
                        } else {
                            return valueArray[0];
                        }

                    }
                },
                //设置transform
                setTransform: function (x, y, type) {
                    if (this.length == 0)return;
                    var val_3d = 'translate3d(' + x + type + ',' + y + type + ',' + 0 + ')',
                        val_2d = 'translate(' + x + type + ',' + y + type + ')',
                        _this = this[0];
                    if (prefix == '-webkit-') {
                        _this.style.webkitTransform = val_3d;
                    } else if (prefix == '-moz-') {
                        _this.style.mozTransform = val_2d;
                    } else if (prefix == '-o-') {
                        _this.style.oTransform = val_2d;
                    } else {
                        _this.style.transform = val_3d;
                    }
                    return this;
                },
                //设置transition
                setTransition: function (attr, time, type) {
                    if (this.length == 0)return;
                    var val = attr + ' ' + time + 's ' + (type || 'ease-out'),
                        _this = this[0];
                    if (prefix == '-webkit-') {
                        _this.style.webkitTransition = attr == 'all' ? val : '-' + prefix + '-' + val;
                    } else if (prefix == '-moz-') {
                        _this.style.mozTransition = attr == 'all' ? val : '-' + prefix + '-' + val;
                    } else if (prefix == '-o-') {
                        _this.style.oTransition = attr == 'all' ? val : '-' + prefix + '-' + val;
                    } else {
                        _this.style.transition = val;
                    }
                    return this;

                },
                //初始化wparallax的元件对象,必须要初始化之后才能执行start方法加载动画
                initElement: function () {
                    var startX = parseInt(this.data('startx')),//param.startX,
                        startY = parseInt(this.data('starty')),//param.startY,
                        effect = this.data('effect');//param.effect,

                    if (effect && effect == 'fadein') {//fadein
                        this[0].style.opacity = 0;
                    } else if (effect && effect == 'fadeout') {//fadeout
                        this[0].style.opacity = 1;
                    }
                    this.setTransform(startX, startY, 'px');
                    return this;
                },
                //wparallax核心方法，加载动画,参数mode模式：模式有两种 scroll滚动 和 scene场景
                start: function (mode) { //mode:模式有两种 scroll滚动 和 scene场景
                    var startX = parseInt(this.data('startx') || 0),//param.startX,
                        startY = parseInt(this.data('starty') || 0),//param.startY,
                        startTiming = parseInt(this.data('startTiming') || 0),//param.startTiming,
                        stopX = parseInt(this.data('stopx') || 0),//param.stopX,
                        stopY = parseInt(this.data('stopy') || 0),//param.stopY,
                        stopTiming = parseInt(this.data('stopTiming') || 0),//param.stopTiming,
                        sceneStartTiming = parseInt(this.data('sceneStartTiming') || 0),
                        sceneDuration = parseInt(this.data('sceneDuration') || '0s'),
                        effect = this.data('effect')||'',//param.effect,
                        moveX,
                        moveY,
                        dictX = stopX - startX,
                        dictY = stopY - startY,
                        $this = this;

                    //firstScene 第一个场景自动播放
                    if(mode === 'scene' && sceneStartTiming === 0){
                        setTimeout(function(){
                            $this.setTransition('all',sceneDuration);
                            $this.setTransform(stopX, stopY, 'px');
                            $this[0].style.opacity = 1;
                        },100);

                    }

                    D.addEventListener('scroll', function () {
                        var scrollTop = D.body.scrollTop,
                            dictPercent = (scrollTop - startTiming) / (stopTiming - startTiming);

                        switch (mode){
                            case 'scene':
                                if(scrollTop >= sceneStartTiming && sceneStartTiming > 0){
                                    $this.setTransition('all',sceneDuration);
                                    $this.setTransform(stopX, stopY, 'px');
                                    $this[0].style.opacity = 1;
                                }
                                break;
                            case 'scroll' :
                                if (dictX) {
                                    moveX = dictX * dictPercent + startX;
                                } else {
                                    moveX = 0 + startX;
                                }

                                if (dictY) {
                                    moveY = dictY * dictPercent + startY;
                                } else {
                                    moveY = 0 + startY;
                                }

                                if (scrollTop > startTiming && scrollTop < stopTiming) {
                                    if (effect && effect == 'fadein') {//fadein
                                        $this[0].style.opacity = Math.abs(dictPercent) > 1 ? 1 : Math.abs(dictPercent);
                                    } else if (effect && effect == 'fadeout') {//fadeout
                                        $this[0].style.opacity = (1 - dictPercent) < 0 ? 0 : 1 - dictPercent;
                                    }
                                    $this.setTransform(moveX, moveY, 'px');
                                } else if (scrollTop < startTiming || scrollTop == 0) {
                                    if (effect && effect == 'fadein') {//fadein
                                        $this[0].style.opacity = 0;
                                    } else if (effect && effect == 'fadeout') {//fadeout
                                        $this[0].style.opacity = 1;
                                    }
                                    $this.setTransform(startX, startY, 'px');
                                } else if (scrollTop > stopTiming) {
                                    if (effect && effect == 'fadein') {//fadein
                                        $this[0].style.opacity = 1;
                                    } else if (effect && effect == 'fadeout') {//fadeout
                                        $this[0].style.opacity = 0;
                                    }
                                    $this.setTransform(stopX, stopY, 'px');
                                }
                                break;
                        }


                    });

                    return this;
                }
            }

            return w$;
        })(),
    //初始化整个滚动动画，传入场景模式（字符串：scene || scroll），elementArray为 W$('.class')的数组
        parallax = {
            init: function (scene,elementArray) {
                var i = 0,
                    len = elementArray.length;
                for (; i < len; i++) {
                    elementArray[i].initElement().start(scene);
                }
            }
        };
    P.W$ = W$;
    P.init = parallax.init;


})(document, window, window.wParallax = window.wParallax || {});
