javascript-parallax
===================

视差滚动的一个小库，回头补充说明,代码还未优化

演示地址：http://wonggithub.github.io/parallax/

/**
 * wParallax
 * Ver 1.2.0
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

调用方法：
parallax.init('模式（scroll || scene）',[W$对象]);

CSS:
   元件的父容器必须设置：
   position: relative;
   overflow: hidden;
