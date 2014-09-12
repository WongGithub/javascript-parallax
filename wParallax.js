/**
 * wParallax
 * Ver 0.0.1
 * Dev Mr.Wong
 *
 * 使用示例：
 *
 * <span class="phone" data-startCoord="95,770" data-stopCoord="95,570" data-startTiming="0" data-stopTiming="150" data-effect="fadein" data-sceneStartTiming="0" data-sceneDuration="1s"></span>
 *
 * data-startCoord="x,y,z" translate起点坐标
 * data-stopCoord="x,y,z" translate终点坐标
 *
 * data-scaleStart="x,y,z" scale起点比例
 * data-scaleStop="x,y,z" scale终点比例
 *
 * data-rerateStart="x,y,z" rerate起点角度
 * data-rerateStop="x,y,z" rerate终点角度
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
                            len = this.length || 1,
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
                setTransform: function (param) {

                    var translate = param.translate,
                        scale = param.scale,
                        rerate = param.rerate,
                        translateX = param.tx || 0,
                        translateY = param.ty || 0,
                        translateZ = param.tz || 0,
                        scaleX = param.sx || 0,
                        scaleY = param.sy || 0,
                        scaleZ = param.sz || 0,
                        rerateX = param.rx || 0,
                        rerateY = param.ry || 0,
                        rerateZ = param.rz || 0,
                        unit = param.unit,
                        val_3d = '',
                        val_2d = '',
                        _this = this.length === 0?this:this[0];
                    if(!!translate){
                        val_3d+='translate3d(' + translateX + unit + ',' + translateY + unit + ',' + translateZ + ') ';
                        val_2d+='translate(' + translateX + unit + ',' + translateY + unit + ') ';
                    }
                    if(!!scale){
                        val_3d += 'scale3d(' + scaleX  + ',' + scaleY  + ',' + scaleZ + ') ',
                        val_2d += 'scale(' + scaleX + ',' + scaleY + ') ';
                    }
                    if(!!rerate){
                        val_3d += 'rerate3d(' + rerateX + 'deg' + ',' + rerateY + 'deg' + ',' + rerateZ + 'deg'+') ',
                        val_2d += 'rerate(' + rerateX + 'deg' + ',' + rerateY + 'deg' + ') ';
                    }

                    if (prefix === '-webkit-') {
                        _this.style.webkitTransform = val_3d;
                    } else if (prefix === '-moz-') {
                        _this.style.mozTransform = val_3d;
                    } else if (prefix === '-ms-') {
                        _this.style.msTransform = val_2d;
                    } else {
                        _this.style.transform = val_3d;
                    }
                    return this;
                },
                //设置transition
                setTransition: function (attr, time, type,delay) {
                    if (this.length == 0)return;
                    var val = attr + ' ' + time + ' ' + (type || 'ease-out')+ ' ' + delay,
                        _this = this[0];
                    if (prefix == '-webkit-') {
                        _this.style.webkitTransition = attr == 'all' ? val : '-' + prefix + '-' + val;
                    } else if (prefix == '-moz-') {
                        _this.style.mozTransition = attr == 'all' ? val : '-' + prefix + '-' + val;
                    } else if (prefix == '-ms-') {
                        _this.style.msTransition = attr == 'all' ? val : '-' + prefix + '-' + val;
                    } else {
                        _this.style.transition = val;
                    }
                    return this;

                },
                //初始化wparallax的元件对象,必须要初始化之后才能执行start方法加载动画
                initElement: function () {
                    var startCoord = this.data('startCoord'),
                        scaleStart = this.data('scaleStart'),
                        rerateStart = this.data('rerateStart'),
                        startX = startCoord?parseInt((startCoord.split(','))[0]):0,
                        startY = startCoord?parseInt((startCoord.split(','))[1]):0,
                        startZ = startCoord?parseInt((startCoord.split(','))[2]):0,
                        scaleStartX = scaleStart?parseInt((scaleStart.split(','))[0]): 0,
                        scaleStartY = scaleStart?parseInt((scaleStart.split(','))[1]): 0,
                        scaleStartZ = scaleStart?parseInt((scaleStart.split(','))[2]): 0,
                        rerateStartX = rerateStart?parseInt((rerateStart.split(','))[0]): 0,
                        rerateStartY = rerateStart?parseInt((rerateStart.split(','))[1]): 0,
                        rerateStartZ = rerateStart?parseInt((rerateStart.split(','))[2]): 0,
                        effect = this.data('effect');//param.effect,

                    if (!!effect && effect == 'fadein') {//fadein
                        this[0].style.opacity = 0;
                    } else if (effect && effect == 'fadeout') {//fadeout
                        this[0].style.opacity = 1;
                    }

                    this.setTransform({
                        translate:startCoord,
                        scale:scaleStart,
                        rerate:rerateStart,
                        tx:startX,
                        ty:startY,
                        tz:startZ,
                        sx:scaleStartX,
                        sy:scaleStartY,
                        sz:scaleStartZ,
                        rx:rerateStartX,
                        ry:rerateStartY,
                        rz:rerateStartZ,
                        unit:'px'
                    });

                    return this;
                },
                //wparallax核心方法，加载动画,参数mode模式：模式有两种 scroll滚动 和 scene场景
                start: function (mode) { //mode:模式有两种 scroll滚动 和 scene场景
                    var startCoord = this.data('startCoord'),
                        stopCoord = this.data('stopCoord'),
                        startX = startCoord?parseInt((startCoord.split(','))[0]):0,
                        startY = startCoord?parseInt((startCoord.split(','))[1]):0,
                        startZ = startCoord?parseInt((startCoord.split(','))[2]):0,
                        startTiming = parseInt(this.data('startTiming') || 0),

                        stopX = stopCoord?parseInt((stopCoord.split(','))[0]):0,
                        stopY = stopCoord?parseInt((stopCoord.split(','))[1]):0,
                        stopZ = stopCoord?parseInt((stopCoord.split(','))[2]):0,
                        stopTiming = parseInt(this.data('stopTiming') || 0),

                        sceneStartTiming = parseInt(this.data('sceneStartTiming') || 0),
                        sceneDuration = this.data('sceneDuration') || '0s',
                        timingFunction = this.data('timingFunction') || 'ease-out',
                        delay = this.data('delay') || '0s',
                        effect = this.data('effect')||'',//param.effect,

                        scaleStart = this.data('scaleStart'),
                        scaleStop = this.data('scaleStop'),
                        scaleStartX = scaleStart?parseInt((scaleStart.split(','))[0]): 0,
                        scaleStartY = scaleStart?parseInt((scaleStart.split(','))[1]): 0,
                        scaleStartZ = scaleStart?parseInt((scaleStart.split(','))[2]): 0,
                        scaleStopX = scaleStop?parseInt((scaleStop.split(','))[0]): 0,
                        scaleStopY = scaleStop?parseInt((scaleStop.split(','))[1]): 0,
                        scaleStopZ = scaleStop?parseInt((scaleStop.split(','))[2]): 0,

                        rerateStart = this.data('rerateStart'),
                        rerateStartX = rerateStart?parseInt((rerateStart.split(','))[0]): 0,
                        rerateStartY = rerateStart?parseInt((rerateStart.split(','))[1]): 0,
                        rerateStartZ = rerateStart?parseInt((rerateStart.split(','))[2]): 0,
                        rerateStop = this.data('rerateStop'),
                        rerateStopX = rerateStop?parseInt((rerateStop.split(','))[0]): 0,
                        rerateStopY = rerateStop?parseInt((rerateStop.split(','))[1]): 0,
                        rerateStopZ = rerateStop?parseInt((rerateStop.split(','))[2]): 0,

                        moveX,
                        moveY,
                        moveZ,
                        dictX = stopX - startX,
                        dictY = stopY - startY,
                        dictZ = stopZ - startZ,
                        $this = this;
                    //firstScene 第一个场景自动播放
                    if(mode === 'scene' && sceneStartTiming === 0){
                        setTimeout(function(){
                            $this.setTransition('all',sceneDuration,timingFunction,delay);

                            $this.setTransform({
                                translate:startCoord,
                                scale:scaleStart,
                                rerate:rerateStart,
                                tx:stopX,
                                ty:stopY,
                                tz:stopZ,
                                sx:scaleStopX,
                                sy:scaleStopY,
                                sz:scaleStopZ,
                                rx:rerateStopX,
                                ry:rerateStopY,
                                rz:rerateStopZ,
                                unit:'px'
                            });
                            $this[0].style.opacity = 1;
                        },100);
                    }

                    D.addEventListener('scroll', function () {
                        var scrollTop = D.body.scrollTop || D.documentElement.scrollTop,
                            dictPercent = (scrollTop - startTiming) / (stopTiming - startTiming);
                        switch (mode){
                            case 'scene':
                                if(scrollTop >= sceneStartTiming && sceneStartTiming > 0){
                                    $this.setTransition('all',sceneDuration,timingFunction,delay);
                                    $this.setTransform({
                                        translate:startCoord,
                                        scale:scaleStart,
                                        rerate:rerateStart,
                                        tx:stopX,
                                        ty:stopY,
                                        tz:stopZ,
                                        sx:scaleStopX,
                                        sy:scaleStopY,
                                        sz:scaleStopZ,
                                        rx:rerateStopX,
                                        ry:rerateStopY,
                                        rz:rerateStopZ,
                                        unit:'px'
                                    });
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
                                    $this.setTransform({
                                        translate:startCoord,
                                        scale:scaleStart,
                                        rerate:rerateStart,
                                        tx:moveX,
                                        ty:moveY,
                                        tz:moveZ,
                                        sx:scaleStopX,
                                        sy:scaleStopY,
                                        sz:scaleStopZ,
                                        rx:rerateStopX,
                                        ry:rerateStopY,
                                        rz:rerateStopZ,
                                        unit:'px'
                                    });
                                } else if (scrollTop < startTiming || scrollTop == 0) {
                                    if (effect && effect == 'fadein') {//fadein
                                        $this[0].style.opacity = 0;
                                    } else if (effect && effect == 'fadeout') {//fadeout
                                        $this[0].style.opacity = 1;
                                    }
                                    $this.setTransform({
                                        translate:startCoord,
                                        scale:scaleStart,
                                        rerate:rerateStart,
                                        tx:startX,
                                        ty:startY,
                                        tz:startZ,
                                        sx:scaleStopX,
                                        sy:scaleStopY,
                                        sz:scaleStopZ,
                                        rx:rerateStopX,
                                        ry:rerateStopY,
                                        rz:rerateStopZ,
                                        unit:'px'
                                    });
                                } else if (scrollTop > stopTiming) {
                                    if (effect && effect == 'fadein') {//fadein
                                        $this[0].style.opacity = 1;
                                    } else if (effect && effect == 'fadeout') {//fadeout
                                        $this[0].style.opacity = 0;
                                    }
                                    $this.setTransform({
                                        translate:startCoord,
                                        scale:scaleStart,
                                        rerate:rerateStart,
                                        tx:stopX,
                                        ty:stopY,
                                        tz:stopZ,
                                        sx:scaleStopX,
                                        sy:scaleStopY,
                                        sz:scaleStopZ,
                                        rx:rerateStopX,
                                        ry:rerateStopY,
                                        rz:rerateStopZ,
                                        unit:'px'
                                    });
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
                if(!{}.__proto__){
                    console.log("%c wParallax Error:关键属性不支持!","font-size:16px;color:#f00;font-weight:bold;");
                    return;
                }
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
