import React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
    ResponsiveContainer,
} from "recharts";

interface ChartProps {
    data: any[];
}

const commonLabelStyle = { fontSize: 12, fontWeight: "bold", fill: "#333" };

export const TimesUsedChart: React.FC<ChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.map(item => item.timesUsed));

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 60 }} animationDuration={1000}>
                <text x="50%" y="20" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#333">
                    Biểu đồ số lần sử dụng voucher tại các giá trị kích hoạt
                </text>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                    dataKey="minActivationValue"
                    label={{
                        value: "Giá trị kích hoạt (VND)",
                        position: "insideBottom",
                        offset: -15,
                        fontSize: 16,
                        fontWeight: "bold",
                        fill: "#555",
                    }}
                    tickFormatter={(value) => new Intl.NumberFormat().format(value)}
                />
                <YAxis
                    label={{
                        angle: -90,
                        position: "insideMiddle",
                        fontSize: 16,
                        fontWeight: "bold",
                        fill: "#555",
                        offset: -20,
                    }}
                    ticks={Array.from({ length: maxValue + 1 }, (_, index) => index)}
                />
                <Tooltip formatter={(value) => `${value} lần`} />
                <Legend
                    verticalAlign="top"
                    align="center"
                    wrapperStyle={{ paddingBottom: 20 }}
                    iconSize={20}
                    fontSize={14}
                />
                <Bar dataKey="timesUsed" fill="#4a90e2" name="Số lần sử dụng">
                    <LabelList dataKey="timesUsed" position="top" style={{ ...commonLabelStyle, fill: "#fff" }} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export const VoucherRevenueChart: React.FC<ChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.map(item => item.revenue));
    const tickUnit = 100000;
    const ticks = Array.from(
        { length: Math.ceil(maxValue / tickUnit) + 1 },
        (_, index) => index * tickUnit
    );

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 40, right: 30, left: 20, bottom: 60 }} animationDuration={1000}>
                <text x="50%" y="20" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#333">
                    Biểu đồ doanh thu mang lại từ các giá trị kích hoạt
                </text>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                    dataKey="minActivationValue"
                    label={{
                        value: "Giá trị kích hoạt (VND)",
                        position: "insideBottom",
                        offset: -15,
                        fontSize: 16,
                        fontWeight: "bold",
                        fill: "#555",
                    }}
                    tickFormatter={(value) => new Intl.NumberFormat().format(value)}
                />
                <YAxis
                    ticks={ticks}
                    label={{
                        angle: -90,
                        position: "insideMiddle",
                        fontSize: 16,
                        fontWeight: "bold",
                        fill: "#555",
                        offset: -20,
                    }}
                />
                <Tooltip formatter={(value) => `${value.toLocaleString()} VND`} />
                <Legend
                    verticalAlign="top"
                    align="center"
                    wrapperStyle={{ paddingBottom: 20 }}
                    iconSize={20}
                    fontSize={14}
                />
                <Bar dataKey="revenue" fill="#2ecc71" name="Doanh thu mang lại">
                    <LabelList
                        dataKey="revenue"
                        position="top"
                        style={{ ...commonLabelStyle, fill: "#fff" }}
                        formatter={(value) => new Intl.NumberFormat().format(value)}
                    />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};
