#!/bin/bash

# Install autostart script for Raspberry Pi
# Run this with: bash install-autostart.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
USER_NAME="${SUDO_USER:-$USER}"

# Create systemd service file
sudo tee /etc/systemd/system/information-monitor.service > /dev/null <<EOF
[Unit]
Description=Information Monitor
After=graphical.target
Wants=graphical.target

[Service]
Type=simple
User=$USER_NAME
WorkingDirectory=$SCRIPT_DIR
Environment="DISPLAY=:0"
Environment="XAUTHORITY=/home/$USER_NAME/.Xauthority"
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=graphical.target
EOF

# Enable the service
echo "Enabling information-monitor service..."
sudo systemctl daemon-reload
sudo systemctl enable information-monitor.service
echo ""
echo "✓ Service installed!"
echo ""
echo "Start the service with:"
echo "  sudo systemctl start information-monitor"
echo ""
echo "View logs:"
echo "  sudo journalctl -u information-monitor -f"
