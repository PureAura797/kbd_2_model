export interface SpecData {
  id: string;
  position: [number, number, number]; // Hotspot position on the 3D model
  target: [number, number, number];   // Where the camera should look
  title: string;
  subtitle: string;
  desc: string;
  technical: { label: string; value: string }[];
}

export const SPEC_POINTS: SpecData[] = [
  {
    id: "display",
    position: [-0.02, 0.015, 0.0],
    target: [-0.02, 0.01, 0.0],
    title: "Адаптивный LCD 4.3”",
    subtitle: "IPS Matrix / 800 NIT",
    desc: "Антибликовое промышленное стекло с проекционно-емкостной матрицей. Гарантированная читаемость при прямых солнечных лучах и поддержка работы в тяжелых перчатках.",
    technical: [
      { label: "Resolution", value: "800x480 px" },
      { label: "Brightness", value: "800 cd/m²" },
      { label: "Touch Type", value: "PCAP 10-point" },
      { label: "Glass Rating", value: "IK08 Impact" }
    ]
  },
  {
    id: "encoder",
    position: [0.035, 0.02, 0.025],
    target: [0.035, 0.02, 0.025],
    title: "Тактильный навигатор",
    subtitle: "Алюминий / 24 шага",
    desc: "Выточенный из цельного куска авиационного алюминия ротор с жесткой механической обратной связью. Обеспечивает слепую навигацию в условиях высокой вибрации.",
    technical: [
      { label: "Material", value: "Alloy 6061-T6" },
      { label: "Feedback", value: "24-step Detent" },
      { label: "Lifespan", value: "5M+ Cycles" }
    ]
  },
  {
    id: "bezel",
    position: [-0.045, 0.012, 0.02],
    target: [-0.045, 0.012, 0.02],
    title: "Фрезерованная Рамка",
    subtitle: "Сплав 6061 / Защита",
    desc: "Монолитный защитный безель, выточенный на CNC-станке. Защищает стеклянную панель от прямых ударов тяжелым инструментом и отводит тепло.",
    technical: [
      { label: "Material", value: "Alloy 6061-T6" },
      { label: "Treatment", value: "Hard Anodized" },
      { label: "Drop Rating", value: "1.5 M to Concrete" }
    ]
  },
  {
    id: "ethernet",
    position: [-0.028, -0.013, -0.038],
    target: [-0.028, -0.013, -0.038],
    title: "Dual RJ45 Ethernet",
    subtitle: "1000 Base-T / Изоляция",
    desc: "Сетевые порты промышленного класса. Обеспечивают быструю передачу данных по Modbus TCP и OPC UA с гальванической защитой от бросков напряжения.",
    technical: [
      { label: "Speed", value: "Авто 1Gbps" },
      { label: "Protocols", value: "Modbus TCP, OPC UA" },
      { label: "Isolation", value: "2.5kV RMS" }
    ]
  },
  {
    id: "microusb",
    position: [-0.01, -0.012, -0.038],
    target: [-0.01, -0.012, -0.038],
    title: "Micro-USB Console",
    subtitle: "Низкоуровневый доступ",
    desc: "Прямой интерфейс для прошивки и сервисной отладки RTOS-ядра без необходимости использования локальной сети.",
    technical: [
      { label: "Standard", value: "USB 2.0 High-Speed" },
      { label: "Power", value: "5V Tolerant" },
      { label: "Baud Rate", value: "115200 bps" }
    ]
  },
  {
    id: "sdcard",
    position: [0.01, -0.012, -0.038],
    target: [0.01, -0.012, -0.038],
    title: "MicroSDXC Слот",
    subtitle: "Архив / Дампы",
    desc: "Защищенный слот для расширения памяти. Позволяет непрерывно писать телеметрию техпроцесса в течение года или мгновенно клонировать конфиг устройства.",
    technical: [
      { label: "Capacity", value: "Up to 128 GB" },
      { label: "Filesystem", value: "FAT32 / exFAT" },
      { label: "Class", value: "UHS-I Industrial" }
    ]
  }
]
