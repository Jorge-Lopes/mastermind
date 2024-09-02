#!/bin/bash

. /usr/src/upgrade-test-scripts/env_setup.sh

# Start the chain in the background
/usr/src/upgrade-test-scripts/start_agd.sh &

# wait for blocks to start being produced
waitForBlock 1

make -C /workspace mint100
make -C /workspace lower-bundle-cost

# bring back chain process to foreground
wait