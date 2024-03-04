import studio from '@theatre/studio';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import useDrag from '../../hooks/use-drag';
import { initialConfig } from '../../constants';

const BgVideo = styled.video`
  position: absolute;
  display: block;
  height: auto;
  box-sizing: border-box;

  /* hide controls on iOS */
  /* &::-webkit-media-controls-panel,
  &::-webkit-media-controls-play-button,
  &::-webkit-media-controls-start-playback-button {
    display: none !important;
    -webkit-appearance: none !important;
  } */

  width: 100vw;
  height: 100vh;
`;

// 要等 loading 完才完成載入中
// 參數：(1) 加上 opacity (2) 加上可以調整捲動 vs. 播放比例
// video + bgVideo 加入載入中判定 + 錯誤處理

export default function BgVideoElement({
  id,
  sheet,
  source,
  stageSize,
  draggable = true,
  onError,
}) {
  const object = sheet.object(id, {
    ...initialConfig.BGVIDEO,
  });

  // Drag setting ----------------------
  const [divRef, setDivRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const dragOpts = useMemo(() => {
    let scrub;
    let initial;
    let firstOnDragCalled = false;
    return {
      onDragStart() {
        scrub = studio.scrub();
        initial = object.value;
        firstOnDragCalled = false;
      },

      onDrag(x, y) {
        const percentX = (x / stageSize.width) * 100;
        const percentY = (y / stageSize.height) * 100;

        if (!firstOnDragCalled) {
          studio.setSelection([object]);
          firstOnDragCalled = true;
        }
        scrub.capture(({ set }) => {
          set(object.props, {
            ...initial,
            position: {
              x: percentX + initial.position.x,
              y: percentY + initial.position.y,
            },
          });
        });
      },
      onDragEnd(dragHappened) {
        if (dragHappened) {
          scrub.commit();
        } else {
          scrub.discard();
        }
      },
      lockCursorTo: 'move',
    };
  }, []);

  draggable && useDrag(divRef, dragOpts);

  // Style setting ----------------------
  const [style, setStyle] = useState({});

  useEffect(() => {
    object.onValuesChange((newValue) => {
      setIsVisible(newValue.visible);
      setStyle({
        left: `${newValue.position.x}%`,
        top: `${newValue.position.y}%`,
        display: `${newValue.visible ? 'block' : 'none'}`,
        width: `${newValue.size.width}%`,
        height: `${newValue.size.height}%`,
        zIndex: `${newValue.zIndex}`,
        transform: `scale(${newValue.scale}) translate(-50%, -50%)`,
      });
    });
  }, [object]);

  const videoRef = useRef(null);

  const setMultipleRefs = (element) => {
    setDivRef(element);
    videoRef.current = element;
  };

  useEffect(() => {
    let initialScrollPos = 0; // 保存 isVisible 變為 true 時的初始滾動位置
    let videoDuration = 0; // 視頻總時長

    // 設置滾動事件處理函數，根據滾動距離調整視頻播放進度
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const scrollDistance = currentScrollPos - initialScrollPos;

      // 根據滾動距離計算應當播放的視頻時間
      // 假設每滾動 250px 播放1秒視頻
      const scrollRatio = scrollDistance / 300;

      let newTime;
      if (scrollDistance < 0) {
        newTime = Math.max(0, videoDuration + scrollRatio);
      } else {
        // newTime = scrollRatio % videoDuration; //這寫法會無限從頭播放
        newTime = scrollRatio;
      }

      if (videoRef.current) {
        // videoRef.current.currentTime = Math.min(
        //   Math.max(newTime, 0),
        //   videoDuration
        // );

        videoRef.current.currentTime = newTime;
      }
    };

    if (isVisible) {
      initialScrollPos = window.scrollY; // 記錄當 isVisible 變為 true 時的滾動位置
      if (videoRef.current) {
        videoDuration = videoRef.current.duration || 0; // 獲取視頻總時長
        videoRef.current.currentTime = 0; // 從視頻開始播放
      }
      window.addEventListener('scroll', handleScroll);
    } else {
      window.removeEventListener('scroll', handleScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible]);

  return (
    <BgVideo
      className='video'
      muted
      autoPlay={false}
      ref={setMultipleRefs}
      style={style}
      preload='auto'
      onClick={() => {
        studio.setSelection([object]);
      }}
      onError={onError}
      controls
    >
      <source src={source} />
    </BgVideo>
  );
}
