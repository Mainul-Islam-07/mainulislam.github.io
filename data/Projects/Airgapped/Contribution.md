Project Description
The Airgapped Wallet is a standalone hardware cryptocurrency wallet built around a touchscreen display module (with camera for QR scanning) and an embedded control board. It is designed to generate, store, and manage private keys/seed phrases entirely offline — the device never connects to the internet or any network. All communication with the outside world (e.g., broadcasting a transaction) happens through QR codes, which keeps the signing keys physically isolated ("air-gapped") from any online system. This architecture protects against remote hacking, malware, and network-based key theft, since a signed transaction can only leave the device visually (via QR) and unsigned transaction data can only enter it the same way, or via camera/manual/saved-address input.
Core value proposition: sign transactions offline, transfer only signed/unsigned transaction data via QR codes, and keep seed phrases/private keys never exposed to a networked device.
Hardware

Touchscreen display + control PCB
Camera module (for QR code scanning)
Physical power button: press to boot; hold ~3 seconds to power off
USB connector (power/data, e.g., via the pictured hub)

Software Feature Set

PIN set/reset and PIN-gated access
Wallet creation with BIP-39-style seed phrase generation (12 or 24 words) and word-by-word verification
Multiple wallets: create, rename, delete, switch active wallet
Custom network management: add/edit/delete networks (key, name, type — evm/utxo/xrp, symbol, chain ID)
QR scanning and QR generation for transactions
Send and Receive transaction flows
Signed transaction generation, displayed as a (possibly multi-page) QR code
Manual input as an alternative to QR scanning
UI theming (e.g., Dark/Light/Contrast) and layout options (Grid/Compact/List)
Invalid input handling
Two keyboard styles: Semi-QWERTY and Numeric

more info: youtube link: https://youtu.be/bSHUT5XJSNQ
show it as a button.