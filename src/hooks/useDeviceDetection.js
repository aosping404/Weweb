import { useState, useEffect } from 'react';
import { isMobileDevice, getDeviceType } from '../utils/deviceDetection';

/**
 * 设备检测Hook
 * @returns {object} 设备信息
 */
export const useDeviceDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const updateDeviceInfo = () => {
      setIsMobile(isMobileDevice());
      setDeviceType(getDeviceType());
    };

    updateDeviceInfo();

    // 监听窗口大小变化
    const handleResize = () => {
      updateDeviceInfo();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    isMobile,
    deviceType,
    isTablet: deviceType === 'tablet',
    isDesktop: deviceType === 'desktop'
  };
};
