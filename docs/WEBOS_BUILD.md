# LG webOS TV - Guia de Build e Deploy

## Requisitos

### Software
- webOS TV SDK (CLI ou IDE)
- Node.js 18+
- Python 3.x (para algumas ferramentas)

### Hardware
- LG Smart TV com webOS 3.0+ para testes
- Computador com Windows, macOS ou Linux

## Instalação do webOS SDK

### Via NPM (Recomendado)
```bash
npm install -g @webosose/ares-cli
```

### Via Instalador
1. Baixe em: https://webostv.developer.lge.com/develop/tools/cli-installation
2. Execute o instalador
3. Adicione ao PATH se necessário

## Configuração do Projeto

### Estrutura de Arquivos
```
webos/
├── appinfo.json        # Configuração do app
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos
├── js/
│   ├── keys.js         # Códigos de teclas do controle
│   ├── navigation.js   # Navegação DPAD
│   ├── player.js       # Player HLS
│   └── app.js          # Aplicação principal
├── images/
│   ├── icon.png        # Ícone 80x80
│   ├── largeIcon.png   # Ícone 130x130
│   └── bgImage.png     # Background 1920x1080
└── webOSTVjs-1.2.4/    # SDK JavaScript (opcional)
```

### Configuração do appinfo.json
O arquivo `appinfo.json` já está configurado com:
- ID único do app
- Versão e vendor
- Resolução 1920x1080
- Permissões necessárias

## Build do Projeto

### Empacotar o App
```bash
# Navegue até a pasta do projeto
cd webos/

# Crie o pacote .ipk
ares-package .

# O arquivo RedFlix_1.0.0_all.ipk será criado
```

### Verificar o Pacote
```bash
ares-package -i com.redflix.tv_1.0.0_all.ipk
```

## Configuração da TV

### Ativar Modo Desenvolvedor
1. Na TV, acesse LG Content Store
2. Busque por "Developer Mode"
3. Instale e abra o app
4. Faça login com sua conta LG Developer
5. Ative "Dev Mode Status"
6. Reinicie a TV

### Registrar a TV
```bash
# Liste dispositivos disponíveis
ares-setup-device --list

# Adicione a TV
ares-setup-device --add webostv --info "{'host':'<TV_IP>', 'port':'9922', 'username':'prisoner'}"

# Configure a chave SSH
ares-novacom --device webostv --getkey
```

## Instalação em TV Real

### Deploy via CLI
```bash
# Instale o app
ares-install --device webostv com.redflix.tv_1.0.0_all.ipk

# Execute o app
ares-launch --device webostv com.redflix.tv

# Veja logs
ares-inspect --device webostv --app com.redflix.tv
```

### Debug
```bash
# Abra o inspector
ares-inspect --device webostv --app com.redflix.tv --open
```

## Funcionalidades Implementadas

### Navegação DPAD
- Setas direcionais: Navegar entre elementos
- OK/Enter: Selecionar
- Back (461): Voltar
- Exit: Sair do app

### Entrada de Canal Numérico
- Digite números no controle remoto
- Overlay aparece mostrando o número
- Timeout de 2.5s para confirmar
- Navega automaticamente para o canal

### Teclado Virtual
- Ao focar em campo de busca, o teclado nativo da TV aparece
- Busca em tempo real conforme digita

### Player HLS
- Suporte nativo a streams HLS (.m3u8)
- Controles de reprodução via controle remoto

## Troubleshooting

### Erro de conexão com TV
- Verifique se o modo desenvolvedor está ativo
- Confirme que o IP está correto
- Verifique se a TV e o computador estão na mesma rede

### App não instala
- Verifique se o appinfo.json está válido
- Confirme que o ID do app é único
- Verifique espaço disponível na TV

### Player não reproduz
- Confirme que a URL do stream está acessível
- Verifique se o formato é HLS válido
- Teste a URL em um player externo

### Teclas não funcionam
- Verifique os códigos de tecla em keys.js
- Confirme que o evento keydown está sendo capturado

## Publicação no LG Content Store

### Checklist
- [ ] Ícone 80x80 PNG
- [ ] Ícone grande 130x130 PNG
- [ ] Background 1920x1080 PNG
- [ ] Screenshots 1920x1080 (mínimo 3)
- [ ] Descrição em português
- [ ] Política de privacidade URL
- [ ] Pacote .ipk testado

### Processo
1. Acesse https://seller.lgappstv.com
2. Crie conta de desenvolvedor
3. Registre novo app
4. Preencha informações
5. Upload do pacote .ipk
6. Submeta para revisão

## Recursos Adicionais

- webOS TV Developer: https://webostv.developer.lge.com/
- webOS TV API: https://webostv.developer.lge.com/api/
- LG Seller Lounge: https://seller.lgappstv.com/
