import serial
import time
import requests

# Arduino'nun bağlı olduğu seri portu belirtin
serial_port = 'COM3'
baud_rate = 9600

# API URL
url = 'http://localhost:3000/api/air-quality'

# Seri portu aç
ser = serial.Serial(serial_port, baud_rate)

# Arduino'dan veri almak ve POST etmek için ana döngü
while True:
    try:
        # Seri port üzerinden gelen veriyi oku
        if ser.in_waiting > 0:
            raw_data = ser.readline().decode('utf-8').strip()
            print(f'Gelen Veri: {raw_data}')

            # 'MQ135 Değeri: ' ifadesini temizle
            if "MQ135 Değeri:" in raw_data:
                sensor_value = raw_data.split(":")[1].strip()  # Sayıyı al
                sensor_value = int(sensor_value)  # Sayıya dönüştür

                # Veriyi JSON formatında POST et
                data = {"value": sensor_value}
                response = requests.post(url, json=data)

                # Response kontrolü
                if response.status_code == (200 | 201):
                    print(f'Veri başarıyla gönderildi: {data}')
                else:
                    print(f'Veri gönderilirken hata oluştu. Status Code: {response.status_code}')

        time.sleep(2)

    except Exception as e:
        print(f'Hata oluştu: {e}')
        break

# Seri portu kapat
ser.close()
