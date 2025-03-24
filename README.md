## Instalação

```bash
git clone https://github.com/pablowilliam/chatwoot.git
cd chatwoot/deployment
chmod +x *.sh
sudo ./setup_20.04.sh --install
```

## Habilitando configurações ocultas do Chatwoot no banco de dados PostgreSQL
```bash
sudo -i -u postgres psql
\c chatwoot_production
```
```bash
update installation_configs set locked = false;
```
```bash
\q
```
## Apoie este projeto ☕  

Se quiser contribuir, você pode me apoiar no [Buy Me a Coffee](https://www.buymeacoffee.com/pablowilliam) ou via PIX:  

**PIX:** contato@site.multichannel.pt  

