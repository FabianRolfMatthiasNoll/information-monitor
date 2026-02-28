#!/bin/bash

# Install autostart script for Raspberry Pi
# Run this with: bash install-autostart.sh

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Create systemd service file
sudo tee /etc/systemd/system/information-monitor.service > /dev/null <<EOF
[Unit]
Description=Information Monitor
After=network.target x11-common.service
Wants=display-manager.service

[Service]
Type=simple
User=$USER
Environment="DISPLAY=:0"
Environment="XAUTHORITY=/home/$USER/.Xauthority"
WorkingDirectory=$SCRIPT_DIR
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
echo "Enabling information-monitor service..."
sudo systemctl daemon-reload
sudo systemctl enable information-monitor.service
echo "Service installed! Start with: sudo systemctl start information-monitor"
echo "View logs with: sudo journalctl -u information-monitor -f"
