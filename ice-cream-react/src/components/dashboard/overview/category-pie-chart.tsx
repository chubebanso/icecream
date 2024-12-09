import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, TooltipItem } from 'chart.js';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface CategoryData {
    productCategory: string;
    productCategoryOrderedQuantity: number;
    productCategoryRevenue: number;
}

const CategoryPieChart: React.FC<{ data: CategoryData[] }> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>Không có dữ liệu để hiển thị.</div>;
    }

    // Màu sắc cho các danh mục
    const categoryColors = {
        "kem": "#FF69B4",  // Kem màu hồng
        "nước": "#36A2EB",  // Nước màu xanh
        "bánh trung thu": "#FF7F50"  // Bánh trung thu màu cam
    };

    // Lấy màu sắc từ danh mục
    const chartData = {
        labels: data.map((category) => category.productCategory),
        datasets: [
            {
                label: 'Doanh số',
                data: data.map((category) => category.productCategoryOrderedQuantity),
                backgroundColor: data.map((category) => {
                    // Áp dụng màu theo danh mục
                    if (category.productCategory.toLowerCase().includes("kem")) {
                        return categoryColors["kem"];
                    } else if (category.productCategory.toLowerCase().includes("nước")) {
                        return categoryColors["nước"];
                    } else if (category.productCategory.toLowerCase().includes("bánh trung thu")) {
                        return categoryColors["bánh trung thu"];
                    } else {
                        // Nếu không có các từ khóa trên, chọn màu ngẫu nhiên
                        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                        return `#${randomColor}`;
                    }
                }),
                hoverBackgroundColor: data.map((category) => {
                    // Tạo màu hover, làm đậm hoặc sáng hơn màu nền
                    if (category.productCategory.toLowerCase().includes("kem")) {
                        return "#FF1493";  // Màu hồng đậm cho kem
                    } else if (category.productCategory.toLowerCase().includes("nước")) {
                        return "#1E90FF";  // Màu xanh đậm cho nước
                    } else if (category.productCategory.toLowerCase().includes("bánh trung thu")) {
                        return "#FF6347";  // Màu cam đậm cho bánh trung thu
                    } else {
                        // Nếu không có các từ khóa trên, chọn màu ngẫu nhiên đậm hơn
                        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                        return `#${randomColor}`;
                    }
                }),
                borderColor: '#fff',
                borderWidth: 2,
                hoverBorderColor: '#000',
                hoverBorderWidth: 3,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Doanh số theo danh mục',
                font: {
                    size: 20,
                    weight: 'bold' as 'bold',
                },
            },
            legend: {
                position: 'bottom' as const,
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem: TooltipItem<'pie'>) {
                        const value = tooltipItem.raw;
                        return `${tooltipItem.label}: ${value}`;
                    },
                },
            },
        },
        cutout: '50%',
        elements: {
            arc: {
                borderWidth: 4, // Border cho mỗi phần tử
            },
        },
        animation: {
            animateRotate: true, // Bật animation khi quay
            animateScale: true,
        },
        layout: {
            padding: 20,
        },
    };

    return <Pie data={chartData} options={options} />;
};

export default CategoryPieChart;
