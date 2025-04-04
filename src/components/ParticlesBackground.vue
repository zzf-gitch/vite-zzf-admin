<template>
    <Particles
      id="tsparticles"
      :particlesInit="particlesInit" 
      :options="options"
    />
  </template>
  
  <script setup>
  import { loadSlim } from "tsparticles-slim";
  
  const particlesInit = async engine => {
      //await loadFull(engine);
      await loadSlim(engine);
  };
   
  // 粒子库 options 配置 - 科技感网格特效
  const options = {
    // 背景配置 - 设置粒子背景的基本属性
    background: {
      color: {
        value: '#000022', // 深蓝色背景，营造科技感氛围
      }
    },
    // 帧率限制 - 控制动画流畅度与性能平衡
    fpsLimit: 120, // 限制最大帧率为120fps，保证流畅度的同时节省性能
    // 交互配置 - 定义用户与粒子的交互方式
    interactivity: {
      // 事件配置 - 定义触发交互的事件类型
      events: {
        onClick: {
          enable: true, // 启用点击事件
          mode: 'push', // 点击时产生新的粒子
        },
        onHover: {
          enable: true, // 启用悬停事件
          mode: 'repulse', // 悬停时粒子会被排斥，产生波纹效果
        },
        resize: true, // 自动适应窗口大小变化，确保全屏效果
      },
      // 交互模式配置 - 定义不同交互模式的具体表现
      modes: {
        // 连接模式 - 鼠标悬停时连接附近粒子
        connect: {
          distance: 150, // 连接距离
          links: {
            opacity: 0.3, // 连接线透明度
            color: '#00ffff', // 青色连接线，增强科技感
          },
          radius: 150, // 连接半径
        },
        // 气泡模式 - 使粒子变大形成气泡效果
        bubble: {
          distance: 400, // 气泡效果触发距离
          duration: 2, // 效果持续时间(秒)
          opacity: 0.6, // 气泡透明度
          size: 20, // 气泡大小
          color: {
            value: '#00ffff', // 青色气泡，增强科技感
          }
        },
        // 推出模式 - 点击时产生新粒子
        push: {
          quantity: 6, // 点击时产生的粒子数量
        },
        // 排斥模式 - 使粒子远离鼠标
        repulse: {
          distance: 150, // 排斥效果距离
          duration: 0.4, // 效果持续时间(秒)
        }
      }
    },
    // 粒子配置 - 定义粒子的外观和行为
    particles: {
      // 粒子颜色 - 定义粒子的颜色
      color: {
        value: ['#00ffff', '#0088ff', '#0044ff', '#ffffff'], // 蓝色系渐变，营造科技感
      },
      // 粒子连接线 - 粒子之间的连线
      links: {
        color: '#00ffff', // 青色连接线
        distance: 150, // 连接线最大距离
        enable: true, // 启用连接线
        opacity: 0.3, // 连接线透明度
        width: 1, // 连接线宽度
      },
      // 粒子碰撞 - 粒子之间的碰撞效果
      collisions: {
        enable: false, // 禁用碰撞检测，提高性能
      },
      // 粒子移动 - 粒子的移动方式
      move: {
        direction: 'none', // 移动方向随机
        enable: true, // 启用移动
        outModes: {
          default: 'bounce', // 碰到边界时反弹，而不是消失
        },
        random: false, // 禁用随机移动，使运动更平滑
        speed: 1, // 移动速度，适中的速度营造流畅感
        straight: false, // 非直线移动
        trail: {
          enable: false, // 禁用轨迹
        },
        // 添加轻微抖动效果，增强动态感
        vibrate: true,
        vibrateDuration: 5,
        vibrateFrequency: 10,
      },
      // 粒子数量 - 控制粒子的数量和分布
      number: {
        density: {
          enable: true, // 启用密度控制
          area: 800, // 密度区域
        },
        value: 80, // 粒子数量，适中数量保证性能和视觉效果
      },
      // 粒子透明度 - 控制粒子的透明度变化
      opacity: {
        value: { min: 0.2, max: 0.8 }, // 透明度范围，增加层次感
        animation: {
          enable: true, // 启用透明度动画
          speed: 0.3, // 动画速度
          minimumValue: 0.2, // 最小透明度
          sync: false, // 非同步动画，增加随机性
        },
      },
      // 粒子形状 - 定义粒子的形状
      shape: {
        type: ['circle', 'triangle', 'square'], // 多种形状混合，增加视觉丰富度
      },
      // 粒子大小 - 控制粒子的大小变化
      size: {
        value: { min: 1, max: 3 }, // 大小范围，适中大小保证清晰度
        animation: {
          enable: true, // 启用大小动画
          speed: 1, // 动画速度
          minimumValue: 0.5, // 最小大小
          sync: false, // 非同步动画，增加随机性
        },
      },
      // 发光效果 - 粒子的闪烁效果
      twinkle: {
        particles: {
          enable: true, // 启用粒子闪烁
          frequency: 0.05, // 闪烁频率，较低频率避免过于花哨
          opacity: 0.8, // 闪烁时的透明度
          color: {
            value: ['#00ffff', '#0088ff'], // 闪烁颜色，蓝色系增强科技感
          },
        },
        lines: {
          enable: true, // 启用线条闪烁
          frequency: 0.02, // 线条闪烁频率
          opacity: 0.5, // 线条闪烁透明度
          color: {
            value: '#00ffff', // 线条闪烁颜色
          }
        }
      },
    },
    // 视网膜检测，提高高DPI设备的显示质量
    detectRetina: true,
  }
  </script>
  
  <style scoped>
  .tsparticles-canvas-el {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 0;
    pointer-events: none;
  }
  </style>