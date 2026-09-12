Add-Type -AssemblyName System.Drawing

$width = 1600
$height = 920
$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)

$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

# 1. Background
$bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(254, 252, 248))
$g.FillRectangle($bgBrush, 0, 0, $width, $height)

# 2. Top Title Pill Badge (Like reference "Data-to-Alert Workflow")
$badgeRect = New-Object System.Drawing.Rectangle 50, 20, 360, 46
$badgeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(235, 238, 242))
$badgePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(15, 23, 42), 2.5)

# Draw rounded pill
$pathPill = New-Object System.Drawing.Drawing2D.GraphicsPath
$r = 16
$pathPill.AddArc(50, 20, $r*2, $r*2, 180, 90)
$pathPill.AddArc(50 + 360 - $r*2, 20, $r*2, $r*2, 270, 90)
$pathPill.AddArc(50 + 360 - $r*2, 20 + 46 - $r*2, $r*2, $r*2, 0, 90)
$pathPill.AddArc(50, 20 + 46 - $r*2, $r*2, $r*2, 90, 90)
$pathPill.CloseFigure()
$g.FillPath($badgeBrush, $pathPill)
$g.DrawPath($badgePen, $pathPill)

$fontTitle = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$titleBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 41, 59))
$g.DrawString("Field-to-Alert Workflow", $fontTitle, $titleBrush, 85, 28)

# 3. Left Side: Terraced Farmland & Root-Zone Soil Profile
# Draw terraced slope steps
$soilBrush1 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(197, 143, 87))  # Topsoil warm brown
$soilBrush2 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(176, 122, 68))  # Root zone
$soilBrush3 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(153, 102, 51))  # Subsoil
$cropGreen = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(74, 144, 44))

# Terraced hill path
$hillPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$hillPath.AddLine(0, 100, 120, 110)
$hillPath.AddLine(120, 110, 220, 150)
$hillPath.AddLine(220, 150, 260, 200)
$hillPath.AddLine(260, 200, 360, 230)
$hillPath.AddLine(360, 230, 400, 300)
$hillPath.AddLine(400, 300, 490, 340)
$hillPath.AddLine(490, 340, 520, 430)
$hillPath.AddLine(520, 430, 530, 560)
$hillPath.AddLine(530, 560, 500, 660)
$hillPath.AddLine(500, 660, 460, 780)
$hillPath.AddLine(460, 780, 440, 920)
$hillPath.AddLine(440, 920, 0, 920)
$hillPath.CloseFigure()

$g.FillPath($soilBrush1, $hillPath)
$hillPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(115, 75, 35), 3)
$g.DrawPath($hillPen, $hillPath)

# Layer lines across the terraces (bench cuts)
$benchPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(135, 88, 42), 3)
$g.DrawLine($benchPen, 0, 260, 380, 260)
$g.DrawLine($benchPen, 0, 410, 505, 410)
$g.DrawLine($benchPen, 0, 570, 528, 570)
$g.DrawLine($benchPen, 0, 720, 480, 720)

# Green crop vegetation tufts on top of terrace benches
$penGreen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(46, 125, 50), 2)
for ($x = 20; $x -lt 360; $x += 25) {
    $g.DrawArc($penGreen, $x, 245, 12, 16, 180, 180)
    $g.DrawArc($penGreen, $x + 6, 242, 12, 19, 180, 180)
}
for ($x = 30; $x -lt 480; $x += 28) {
    $g.DrawArc($penGreen, $x, 395, 12, 16, 180, 180)
    $g.DrawArc($penGreen, $x + 6, 392, 12, 19, 180, 180)
}
for ($x = 30; $x -lt 500; $x += 30) {
    $g.DrawArc($penGreen, $x, 555, 12, 16, 180, 180)
    $g.DrawArc($penGreen, $x + 6, 552, 12, 19, 180, 180)
}

# Soil Stratum Label in Hill
$fontStratum = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Italic)
$stratumBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(240, 220, 190))
$g.DrawString("Topsoil Layer (Organic Humus)", $fontStratum, $stratumBrush, 40, 210)
$g.DrawString("Root-Zone Depletion Horizon", $fontStratum, $stratumBrush, 40, 360)
$g.DrawString("Subsoil Moisture Retention (Clay/Silt)", $fontStratum, $stratumBrush, 40, 510)
$g.DrawString("Deep Capillary Fringe & Aquifer", $fontStratum, $stratumBrush, 40, 670)

# In-Situ Sensor Bracket & Labels (Matching reference)
$fontSensor = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$sensorBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(15, 23, 42))

$g.DrawString("Soil Moisture (VWC %)", $fontSensor, $sensorBrush, 210, 595)
$g.DrawString("Soil Suction (Tensiometer)", $fontSensor, $sensorBrush, 170, 645)
$g.DrawString("Evapotranspiration (ET₀)", $fontSensor, $sensorBrush, 180, 695)
$g.DrawString("Root-Zone Pore Pressure", $fontSensor, $sensorBrush, 180, 745)

# Bracket Lines
$bracketPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(15, 23, 42), 2.5)
$g.DrawLine($bracketPen, 460, 608, 480, 608)
$g.DrawLine($bracketPen, 460, 658, 480, 658)
$g.DrawLine($bracketPen, 460, 708, 480, 708)
$g.DrawLine($bracketPen, 460, 758, 480, 758)

$g.DrawLine($bracketPen, 480, 608, 480, 758)
$g.DrawLine($bracketPen, 480, 683, 510, 683)

# 4. Center Top: Agriculture Drone (UAV Photogrammetry)
$droneX = 720
$droneY = 80
# Drone Arms & Body
$dronePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(15, 23, 42), 4)
$droneBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 41, 59))
$g.DrawLine($dronePen, $droneX - 60, $droneY - 25, $droneX + 60, $droneY + 25)
$g.DrawLine($dronePen, $droneX - 60, $droneY + 25, $droneX + 60, $droneY - 25)
$g.FillEllipse($droneBrush, $droneX - 22, $droneY - 18, 44, 36)
# Rotor circles
$rotorPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(51, 65, 85), 2.5)
$g.DrawEllipse($rotorPen, $droneX - 85, $droneY - 40, 45, 14)
$g.DrawEllipse($rotorPen, $droneX + 40, $droneY - 40, 45, 14)
$g.DrawEllipse($rotorPen, $droneX - 85, $droneY + 26, 45, 14)
$g.DrawEllipse($rotorPen, $droneX + 40, $droneY + 26, 45, 14)
# Camera gimbal & Spray nozzle
$gimbalBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(2, 132, 199))
$g.FillEllipse($gimbalBrush, $droneX - 8, $droneY + 16, 16, 16)
$fontDrone = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Precision Agri Drone", $fontDrone, $sensorBrush, $droneX - 75, $droneY + 52)
$fontDroneSub = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)
$g.DrawString("(Multispectral / Spray UAV)", $fontDroneSub, [System.Drawing.Brushes]::DimGray, $droneX - 72, $droneY + 74)

# 5. Center Middle: AI Server Workstation
$serverX = 700
$serverY = 320
# PC Tower
$towerBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(51, 65, 85))
$g.FillRectangle($towerBrush, $serverX - 45, $serverY, 38, 95)
$ledBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(34, 197, 94))
$g.FillEllipse($ledBrush, $serverX - 30, $serverY + 20, 8, 8)
$g.FillEllipse($ledBrush, $serverX - 30, $serverY + 36, 8, 8)
# Monitor
$monitorBorder = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 41, 59))
$g.FillRectangle($monitorBorder, $serverX + 5, $serverY - 10, 110, 80)
$screenBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(56, 189, 248))
$g.FillRectangle($screenBrush, $serverX + 11, $serverY - 4, 98, 68)
# Stand
$g.FillRectangle($monitorBorder, $serverX + 50, $serverY + 70, 20, 22)
$g.FillRectangle($monitorBorder, $serverX + 35, $serverY + 90, 50, 8)
# Text label
$fontServer = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Krishi Jal AI Server", $fontServer, $sensorBrush, $serverX - 40, $serverY + 105)
$fontServerSub = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)
$g.DrawString("(FAO-56 Hydrology & Vision Model)", $fontServerSub, [System.Drawing.Brushes]::DimGray, $serverX - 60, $serverY + 130)

# 6. Center Bottom: Agronomists & Field Engineers
$engX = 720
$engY = 660
# Hardhats
$hatBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(249, 115, 22))
$hatPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(194, 65, 12), 2)
$g.FillEllipse($hatBrush, $engX - 60, $engY - 40, 44, 25)
$g.DrawEllipse($hatPen, $engX - 60, $engY - 40, 44, 25)
$g.FillEllipse($hatBrush, $engX + 15, $engY - 30, 44, 25)
$g.DrawEllipse($hatPen, $engX + 15, $engY - 30, 44, 25)
# Faces
$faceBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(254, 215, 170))
$g.FillEllipse($faceBrush, $engX - 52, $engY - 20, 28, 28)
$g.FillEllipse($faceBrush, $engX + 23, $engY - 12, 28, 28)
# Suit & Blueprint
$suitBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 58, 138))
$g.FillRectangle($suitBrush, $engX - 68, $engY + 10, 60, 90)
$g.FillRectangle($suitBrush, $engX + 8, $engY + 18, 60, 82)
# Blueprint paper
$bluepBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(186, 230, 253))
$bluepPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(2, 132, 199), 2)
$g.FillPolygon($bluepBrush, @(
    (New-Object System.Drawing.Point ($engX - 25), ($engY + 45)),
    (New-Object System.Drawing.Point ($engX + 45), ($engY + 25)),
    (New-Object System.Drawing.Point ($engX + 55), ($engY + 95)),
    (New-Object System.Drawing.Point ($engX - 15), ($engY + 115))
))
$g.DrawPolygon($bluepPen, @(
    (New-Object System.Drawing.Point ($engX - 25), ($engY + 45)),
    (New-Object System.Drawing.Point ($engX + 45), ($engY + 25)),
    (New-Object System.Drawing.Point ($engX + 55), ($engY + 95)),
    (New-Object System.Drawing.Point ($engX - 15), ($engY + 115))
))
$fontEng = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Agronomists & Field Officers", $fontEng, $sensorBrush, $engX - 70, $engY + 130)

# 7. Top Right: Smart Farm / Automated Irrigation Field Plot (Control Room Dashboard)
$plotX = 1040
$plotY = 90
# 3D farmland base
$farmBase = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(245, 230, 211))
$farmBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(180, 140, 90), 2)
$plotPoly = @(
    (New-Object System.Drawing.Point ($plotX + 70), ($plotY)),
    (New-Object System.Drawing.Point ($plotX + 230), ($plotY + 20)),
    (New-Object System.Drawing.Point ($plotX + 160), ($plotY + 120)),
    (New-Object System.Drawing.Point ($plotX), ($plotY + 95))
)
$g.FillPolygon($farmBase, $plotPoly)
$g.DrawPolygon($farmBorder, $plotPoly)
# Crop rows on plot
$rowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(34, 197, 94), 3)
$g.DrawLine($rowPen, $plotX + 40, $plotY + 80, $plotX + 180, $plotY + 40)
$g.DrawLine($rowPen, $plotX + 60, $plotY + 90, $plotX + 195, $plotY + 50)
$g.DrawLine($rowPen, $plotX + 80, $plotY + 100, $plotX + 210, $plotY + 60)
# Solar pump / Wind turbine
$polePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(15, 23, 42), 3)
$g.DrawLine($polePen, $plotX + 115, $plotY + 50, $plotX + 115, $plotY - 30)
$bladePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(56, 189, 248), 3)
$g.DrawLine($bladePen, $plotX + 115, $plotY - 30, $plotX + 90, $plotY - 55)
$g.DrawLine($bladePen, $plotX + 115, $plotY - 30, $plotX + 140, $plotY - 55)
$g.DrawLine($bladePen, $plotX + 115, $plotY - 30, $plotX + 115, $plotY - 2)

$fontControl = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Smart Irrigation Controller", $fontControl, $sensorBrush, $plotX - 10, $plotY + 130)
$g.DrawString("& Farm Management Hub", $fontControl, $sensorBrush, $plotX + 5, $plotY + 155)

# 8. Multi-Channel Alert Notification Icons (SMS, Siren, Email/WhatsApp)
$alertX = 1380
$alertY = 50

# Channel 1: SMS (Yellow envelope with SMS badge)
$smsBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(254, 240, 138))
$smsBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(234, 179, 8), 2)
$g.FillRectangle($smsBg, $alertX, $alertY, 65, 45)
$g.DrawRectangle($smsBorder, $alertX, $alertY, 65, 45)
$g.DrawLine($smsBorder, $alertX, $alertY, $alertX + 32, $alertY + 24)
$g.DrawLine($smsBorder, $alertX + 65, $alertY, $alertX + 32, $alertY + 24)
$fontBadge = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$badgeRed = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(225, 29, 72))
$g.FillRectangle($badgeRed, $alertX + 18, $alertY - 8, 30, 15)
$g.DrawString("SMS", $fontBadge, [System.Drawing.Brushes]::White, $alertX + 20, $alertY - 8)
$fontLabel = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Kisan SMS", $fontLabel, $sensorBrush, $alertX + 80, $alertY + 10)

# Channel 2: Siren / Automated Pump Trip (Red warning beacon)
$sirenY = $alertY + 80
$sirenBase = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(51, 65, 85))
$g.FillRectangle($sirenBase, $alertX + 5, $sirenY + 30, 55, 14)
$sirenRed = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(225, 29, 72))
$g.FillPie($sirenRed, $alertX + 12, $sirenY, 42, 50, 180, 180)
# Radiation rays
$rayPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(244, 63, 94), 2.5)
$g.DrawLine($rayPen, $alertX - 5, $sirenY + 10, $alertX + 5, $sirenY + 14)
$g.DrawLine($rayPen, $alertX + 32, $sirenY - 10, $alertX + 32, $sirenY - 2)
$g.DrawLine($rayPen, $alertX + 68, $sirenY + 10, $alertX + 58, $sirenY + 14)
$g.DrawString("Siren / Pump Trip", $fontLabel, $sensorBrush, $alertX + 80, $sirenY + 12)

# Channel 3: WhatsApp & Email Advisory
$emailY = $sirenY + 80
$emailBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(254, 240, 138))
$emailBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(234, 179, 8), 2)
$g.FillRectangle($emailBg, $alertX, $emailY, 65, 45)
$g.DrawRectangle($emailBorder, $alertX, $emailY, 65, 45)
# Green @ stamp
$atBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(22, 163, 74))
$g.FillEllipse($atBrush, $alertX + 18, $emailY + 8, 28, 28)
$g.DrawString("@", $fontBadge, [System.Drawing.Brushes]::White, $alertX + 26, $emailY + 14)
$g.DrawString("WhatsApp / Email", $fontLabel, $sensorBrush, $alertX + 80, $emailY + 10)

# Curly bracket connecting Smart Farm Plot to the 3 channels
$curlyPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(15, 23, 42), 2.5)
$cx = $alertX - 25
$g.DrawLine($curlyPen, $cx, $alertY + 15, $cx - 15, $alertY + 15)
$g.DrawLine($curlyPen, $cx - 15, $alertY + 15, $cx - 15, $sirenY + 15)
$g.DrawLine($curlyPen, $cx - 15, $sirenY + 15, $cx - 30, $sirenY + 15) # middle tip
$g.DrawLine($curlyPen, $cx - 15, $sirenY + 15, $cx - 15, $emailY + 15)
$g.DrawLine($curlyPen, $cx - 15, $emailY + 15, $cx, $emailY + 15)

# Connect Plot to Bracket
$g.DrawLine($curlyPen, $plotX + 225, $plotY + 60, $cx - 30, $sirenY + 15)

# 9. Bottom Right: Control Room Operations Dashboard & Mobile Phone Alert
$dashX = 1060
$dashY = 560

# Desktop Monitor
$dashBorder = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(51, 65, 85))
$g.FillRectangle($dashBorder, $dashX, $dashY, 190, 130)
$dashScreen = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(241, 245, 249))
$g.FillRectangle($dashScreen, $dashX + 8, $dashY + 8, 174, 114)
# Monitor Stand
$g.FillRectangle($dashBorder, $dashX + 85, $dashY + 130, 20, 25)
$g.FillRectangle($dashBorder, $dashX + 60, $dashY + 155, 70, 10)
# Dashboard UI bars (colored charts)
$barRed = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(239, 68, 68))
$barYellow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(245, 158, 11))
$barGreen = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(34, 197, 94))
$barBlue = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(59, 130, 246))

$g.FillRectangle($barYellow, $dashX + 18, $dashY + 20, 32, 14)
$g.FillRectangle($barGreen, $dashX + 58, $dashY + 20, 32, 14)
$g.FillRectangle($barBlue, $dashX + 98, $dashY + 20, 32, 14)
$g.FillRectangle($barRed, $dashX + 138, $dashY + 20, 32, 14)

# Chart line
$chartPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(37, 99, 235), 3)
$g.DrawLine($chartPen, $dashX + 20, $dashY + 95, $dashX + 60, $dashY + 70)
$g.DrawLine($chartPen, $dashX + 60, $dashY + 70, $dashX + 100, $dashY + 85)
$g.DrawLine($chartPen, $dashX + 100, $dashY + 85, $dashX + 140, $dashY + 50)
$g.DrawLine($chartPen, $dashX + 140, $dashY + 50, $dashX + 170, $dashY + 60)

$g.DrawString("Control Room Dashboard", $fontControl, $sensorBrush, $dashX + 2, $dashY + 175)
$g.DrawString("(Real-time Soil & Flow Charts)", $fontDroneSub, [System.Drawing.Brushes]::DimGray, $dashX + 15, $dashY + 202)

# Mobile Phone with ALERT
$phoneX = 1380
$phoneY = 530
$phoneBorder = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(15, 23, 42))
$g.FillRectangle($phoneBorder, $phoneX, $phoneY, 100, 180)
$phoneScreen = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 255, 255))
$g.FillRectangle($phoneScreen, $phoneX + 7, $phoneY + 16, 86, 145)
# Speaker & Home button
$g.FillEllipse([System.Drawing.Brushes]::Gray, $phoneX + 45, $phoneY + 6, 10, 4)
$g.FillEllipse([System.Drawing.Brushes]::Gray, $phoneX + 44, $phoneY + 166, 12, 10)

# Alert box on phone screen
$phoneAlertBg = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(254, 226, 226))
$g.FillRectangle($phoneAlertBg, $phoneX + 10, $phoneY + 30, 80, 90)
$alertBorder = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(220, 38, 38), 2)
$g.DrawRectangle($alertBorder, $phoneX + 10, $phoneY + 30, 80, 90)

$fontPhoneAlert = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$redBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(185, 28, 28))
$g.DrawString("ALERT", $fontPhoneAlert, $redBrush, $phoneX + 22, $phoneY + 38)

$fontPhoneBody = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
$g.DrawString("WATER DEFICIT", $fontPhoneBody, $sensorBrush, $phoneX + 12, $phoneY + 62)
$g.DrawString("Depletion > 50%", $fontPhoneBody, [System.Drawing.Brushes]::DarkRed, $phoneX + 12, $phoneY + 76)
$g.DrawString("Run: 2.5 Hours", $fontPhoneBody, [System.Drawing.Brushes]::DarkGreen, $phoneX + 12, $phoneY + 92)

$fontMobile = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Farmer Mobile PWA", $fontMobile, $sensorBrush, $phoneX - 15, $phoneY + 190)

# Arrow from Dashboard to Phone
$arrowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(15, 23, 42), 3)
$arrowPen.CustomEndCap = New-Object System.Drawing.Drawing2D.AdjustableArrowCap 6, 6, $true
$g.DrawLine($arrowPen, $dashX + 190, $dashY + 65, $phoneX - 5, $phoneY + 90)

# 10. SYSTEM CONNECTING WIRES (Exactly following reference image routing)
$wirePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(15, 23, 42), 2.5)

# Wire A: Field Sensors to AI Server
# Starts at bracket ($x=510, $y=683), travels horizontally, drops/turns to server
$g.DrawLine($wirePen, 510, 683, 620, 683)
$g.DrawLine($wirePen, 620, 683, 620, 365)
$g.DrawLine($wirePen, 620, 365, $serverX - 45, 365)

# Wire B: Drone to AI Server
$g.DrawLine($wirePen, $droneX, $droneY + 95, $droneX, 230)
$g.DrawLine($wirePen, $droneX, 230, $serverX - 25, 230)
$g.DrawLine($wirePen, $serverX - 25, 230, $serverX - 25, $serverY)

# Wire C: AI Server to Dashboard (Right bottom)
# Exits right of AI server monitor, routes downward and into desktop dashboard
$g.DrawLine($wirePen, $serverX + 115, $serverY + 30, 940, $serverY + 30)
$g.DrawLine($wirePen, 940, $serverY + 30, 940, $dashY + 65)
$g.DrawLine($wirePen, 940, $dashY + 65, $dashX, $dashY + 65)

# 11. Save Image Files
$dest1 = "c:\Users\Narayan Priyadarshi\OneDrive\Desktop\Agriculture-Project\krishi_jal_field_to_alert_workflow.png"
$dest2 = "c:\Users\Narayan Priyadarshi\OneDrive\Desktop\Agriculture-Project\all_images\krishi_jal_field_to_alert_workflow.png"
$dest3 = "c:\Users\Narayan Priyadarshi\OneDrive\Desktop\Agriculture-Project\all_images\1_workflows_and_diagrams\krishi_jal_field_to_alert_workflow.png"
$dest4 = "c:\Users\Narayan Priyadarshi\OneDrive\Desktop\Agriculture-Project\public\diagrams\krishi_jal_field_to_alert_workflow.png"
$brainDest = "C:\Users\Narayan Priyadarshi\.gemini\antigravity-ide\brain\e0a67cc3-bcf6-423e-a8f7-d1b0ebcf5ad9\krishi_jal_field_to_alert_workflow.png"

$bmp.Save($dest1, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($dest2, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($dest3, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($dest4, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Save($brainDest, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()

Write-Output "Successfully created high-resolution PNG image: $dest1"
