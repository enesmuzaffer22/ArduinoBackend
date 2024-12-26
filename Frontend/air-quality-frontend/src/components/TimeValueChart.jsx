import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js eklentilerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TimeValueChart = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  // API'den veri çekme fonksiyonu
  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/api/air-quality"); // API URL'nizi buraya ekleyin
    const data = await response.json();

    // API'den gelen veriyi formatlama
    const labels = data.map((item) =>
      new Date(item.timestamp).toLocaleTimeString()
    ); // Zamanı uygun formatta göster
    const values = data.map((item) => item.value);

    // Chart.js verisini oluşturma
    setChartData({
      labels: labels,
      datasets: [
        {
          label: "Değerler", // Y eksenindeki veriler
          data: values, // Y eksenindeki değerler
          fill: false, // Çizgi altını doldurmaz
          borderColor: "rgb(75, 192, 192)", // Çizgi rengi
          tension: 0.1, // Çizgi gerilmesi
          pointBackgroundColor: "rgb(75, 192, 192)", // Nokta rengi
          pointRadius: 5, // Nokta çapı
        },
      ],
    });
  };

  useEffect(() => {
    // İlk veri çekme
    fetchData();

    // 10 saniyede bir API'den veri çekme
    const intervalId = setInterval(fetchData, 10000); // 10000ms = 10 saniye

    // Component unmount olduğunda interval'i temizleyin
    return () => clearInterval(intervalId);
  }, []); // Bileşen ilk yüklendiğinde çalışacak

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Zaman",
        },
        ticks: {
          autoSkip: true, // Zaman ekseni çok yoğun olduğunda etiketler arasını boş bırak
          maxRotation: 45, // Etiketleri 45 derece döndür
          minRotation: 30, // Etiketleri 30 derece döndür
        },
      },
      y: {
        title: {
          display: true,
          text: "Değerler",
        },
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default TimeValueChart;
