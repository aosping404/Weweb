/**
 * 设备检测工具函数
 */

/**
 * 检测是否为移动设备
 * @returns {boolean} 是否为移动设备
 */
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * 检测是否为平板设备
 * @returns {boolean} 是否为平板设备
 */
export const isTabletDevice = () => {
  return /iPad|Android/i.test(navigator.userAgent) && !isMobileDevice();
};

/**
 * 检测是否为桌面设备
 * @returns {boolean} 是否为桌面设备
 */
export const isDesktopDevice = () => {
  return !isMobileDevice() && !isTabletDevice();
};

/**
 * 获取设备类型
 * @returns {string} 设备类型：'mobile' | 'tablet' | 'desktop'
 */
export const getDeviceType = () => {
  if (isMobileDevice()) return 'mobile';
  if (isTabletDevice()) return 'tablet';
  return 'desktop';
};
