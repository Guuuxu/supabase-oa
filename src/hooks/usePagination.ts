import { useState, useMemo } from 'react';

/**
 * 通用分页Hook
 * @param data 原始数据数组
 * @param itemsPerPage 每页显示的条目数，默认15条
 * @returns 分页相关的状态和方法
 */
export function usePagination<T>(data: T[], itemsPerPage: number = 15) {
  const [currentPage, setCurrentPage] = useState(1);

  // 计算总页数
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  // 获取当前页的数据
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // 跳转到指定页
  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  // 上一页
  const goToPreviousPage = () => {
    goToPage(currentPage - 1);
  };

  // 下一页
  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  // 重置到第一页
  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    resetPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, data.length),
    totalItems: data.length,
  };
}
