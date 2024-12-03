import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title, TooltipItem } from 'chart.js';

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface CartData {
    name: string;
    productOrderedQuantity: number;
}

const ProductPieChart: React.FC<{ data: CartData[] }> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div>Không có dữ liệu để hiển thị.</div>;
    }

    // Dữ liệu cho pie chart Doanh số theo sản phẩm
    const chartData = {
        labels: data.map((cart) => cart.name), // Tên sản phẩm làm legend
        datasets: [
            {
                label: 'Doanh số sản phẩm',
                data: data.map((cart) => cart.productOrderedQuantity), // Doanh số là giá trị
                backgroundColor: data.map(() => {
                    // Màu ngẫu nhiên cho mỗi sản phẩm
                    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                    return `#${randomColor}`;
                }),
                hoverBackgroundColor: data.map(() => {
                    // Tạo màu hover sáng hơn
                    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
                    return `#${randomColor}`;
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
                text: 'Doanh số theo sản phẩm',
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

    return (
        <div>
            <Pie data={chartData} options={options} />
        </div>
    );
};

export default ProductPieChart;
