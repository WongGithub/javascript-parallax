javascript-parallax
===================

视差滚动的一个小库，回头补充说明,代码还未优化

演示地址：http://wonggithub.github.io/parallax/

/**
 * wParallax
 * Ver 0.0.1
 * Dev Mr.Wong
 *
 * 使用示例：
 *
 * \<span class="phone" data-startCoord="95,770" data-stopCoord="95,570" data-startTiming="0" data-stopTiming="150" data-effect="fadein" data-sceneStartTiming="0" data-sceneDuration="1s"\>\<\/span\>
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

调用方法：
parallax.init('模式（scroll || scene）',[W$对象]);

CSS:
   元件的父容器必须设置：
   position: relative;
   overflow: hidden;
