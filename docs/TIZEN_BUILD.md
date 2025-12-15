# Samsung Tizen TV - Guia de Build e Deploy

## Requisitos

### Software
- Tizen Studio 5.0 ou superior
- Samsung TV SDK
- Node.js 18+ (para desenvolvimento)
- Java JDK 11+

### Hardware
- Samsung Smart TV (2015 ou mais recente) para testes
- Computador com Windows, macOS ou Linux

## Instalação do Tizen Studio

1. Baixe o Tizen Studio em: https://developer.tizen.org/development/tizen-studio/download
2. Execute o instalador e siga as instruções
3. Após instalação, abra o Package Manager e instale:
   - Tizen SDK tools
   - TV Extensions-6.0 (ou versão mais recente)
   - Samsung Certificate Extension

## Configuração do Projeto

### Estrutura de Arquivos
```
tizen/
├── config.xml          # Configuração do app
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos
├── js/
│   ├── keys.js         # Códigos de teclas do controle
│   ├── navigation.js   # Navegação DPAD
│   ├── player.js       # Player HLS
│   └── app.js          # Aplicação principal
└── images/
    └── icon.png        # Ícone do app (512x512)
```

### Configuração do config.xml
O arquivo `config.xml` já está configurado com:
- Privilégios de internet e TV
- Suporte a teclas do controle remoto
- Resolução 1920x1080
- Orientação landscape

## Build do Projeto

### Via Tizen Studio IDE

1. Abra o Tizen Studio
2. File > Import > Tizen > Tizen Project
3. Selecione a pasta `tizen/`
4. Clique em Finish
5. Right-click no projeto > Build Signed Package

### Via Linha de Comando

```bash
# Navegue até a pasta do projeto
cd tizen/

# Crie o pacote .wgt
tizen build-web -out .buildResult

# Assine o pacote (requer certificado)
tizen package -t wgt -s <certificate_profile> -- .buildResult
```

## Certificados

### Certificado de Desenvolvimento
1. No Tizen Studio, vá em Tools > Certificate Manager
2. Clique em "+" para criar novo perfil
3. Selecione "Samsung" como tipo
4. Siga o assistente para criar certificado de desenvolvimento

### Certificado de Distribuição
1. Acesse Samsung Seller Office: https://seller.samsungapps.com
2. Crie uma conta de desenvolvedor
3. Gere certificado de distribuição no Certificate Manager

## Instalação em TV Real

### Modo Desenvolvedor na TV
1. Na TV, vá em Apps
2. Digite "12345" no controle remoto
3. Ative "Developer mode"
4. Insira o IP do seu computador
5. Reinicie a TV

### Deploy via Tizen Studio
1. Conecte à TV: Tools > Device Manager > Remote Device Manager
2. Adicione a TV pelo IP
3. Right-click no projeto > Run As > Tizen Web Application

### Deploy via Linha de Comando
```bash
# Conecte à TV
sdb connect <TV_IP>

# Instale o app
tizen install -n RedFlix.wgt -t <device_serial>

# Execute o app
tizen run -p redflix.tv -t <device_serial>
```

## Funcionalidades Implementadas

### Navegação DPAD
- Setas direcionais: Navegar entre elementos
- OK/Enter: Selecionar
- Back: Voltar
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

### App não instala
- Verifique se o modo desenvolvedor está ativo
- Confirme que o IP está correto
- Verifique se o certificado está válido

### Erro de certificado
- Regenere o certificado no Certificate Manager
- Verifique se o DUID da TV está registrado

### Player não reproduz
- Confirme que a URL do stream está acessível
- Verifique se o formato é HLS válido
- Teste a URL em um player externo

### Teclas não funcionam
- Verifique se as teclas estão registradas em keys.js
- Confirme os privilégios em config.xml

## Publicação na Samsung Seller Office

### Checklist
- [ ] Ícone 512x512 PNG
- [ ] Screenshots 1920x1080 (mínimo 4)
- [ ] Descrição em português
- [ ] Política de privacidade URL
- [ ] Certificado de distribuição válido
- [ ] Pacote .wgt assinado

### Processo
1. Acesse https://seller.samsungapps.com
2. Crie novo app TV
3. Preencha informações do app
4. Upload do pacote .wgt
5. Submeta para revisão

## Recursos Adicionais

- Documentação Tizen: https://docs.tizen.org/
- Samsung Developers: https://developer.samsung.com/tv
- Tizen TV Web API: https://docs.tizen.org/application/web/api/
