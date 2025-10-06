import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getTopRatedProducts, getLowestRatedProducts } from "../../services/saleReportService";
import { Spinner, Card } from "react-bootstrap";

const ProductRatingChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setLoading(true);

        // Gọi cả 2 API song song
        const [topRes, lowRes] = await Promise.all([
          getTopRatedProducts(),
          getLowestRatedProducts(),
        ]);

      const top = (topRes.data || []).slice(0, 10).map(p => ({
        productName: p.productName,
        avgRating: p.averageRating,
        reviewCount: p.reviewCount,
        type: "Cao",
        }));

        const low = (lowRes.data || []).slice(0, 10).map(p => ({
        productName: p.productName,
        avgRating: p.averageRating,
        reviewCount: p.reviewCount, 
        type: "Thấp",
        }));

    setData([...top, ...low]);


      } catch (err) {
        console.error("Lỗi khi tải dữ liệu đánh giá:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="mb-3">Đánh giá sản phẩm (Top cao & thấp)</h5>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <div style={{ width: "100%", height: 500 }}>
            <ResponsiveContainer>
              <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  domain={[1, 5]}
                  tickFormatter={(v) => v.toFixed(1)}
                />
                <YAxis
                  dataKey="productName"
                  type="category"
                  width={150}
                />
                <Tooltip formatter={(v) => `${v.toFixed(1)} ⭐`} />
                <Legend />
                <Bar
                  dataKey="avgRating"
                  fill="#88ca82ff"
                  name="Đánh giá TB"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ProductRatingChart;
