#!/bin/bash -e
XDG_RUNTIME_DIR="/run/user/$(id -u)"
# sudo mkdir -p "$XDG_RUNTIME_DIR"                      # only required once
# sudo chmod 700 "$XDG_RUNTIME_DIR"                     # only required once
# sudo chown "$(id -un)":"$(id -gn)" "$XDG_RUNTIME_DIR" # only required once
export DBUS_SESSION_BUS_ADDRESS=unix:path="$XDG_RUNTIME_DIR"/bus
dbus-daemon --session --address="$DBUS_SESSION_BUS_ADDRESS" --nofork --nopidfile --syslog-only &
# EOF
