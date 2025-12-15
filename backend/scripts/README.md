# Scripts de Ingestao de Dados

Este diretorio contem scripts para popular o banco de dados com dados de filmes e series.

## Scripts Disponiveis

### 1. `ingest-tmdb-data.ts`

Script principal que busca dados do TMDB (The Movie Database) para popular o banco com:
- 500 filmes populares
- 500 series populares
- Metadados completos (sinopse, generos, pais, idioma, etc.)
- Elenco completo (atores com personagens)
- Diretores e criadores
- Temporadas e episodios (para series)
- Trailers do YouTube
- Logos oficiais

#### APIs Utilizadas

- **TMDB API** (https://api.themoviedb.org/3)
  - 3 chaves com rotacao automatica para evitar rate limits
  - Limite: 40 requests/10s por chave
  - Rotacao a cada 35 requests

#### Como Executar

Configure as chaves TMDB via variaveis de ambiente:

```bash
cd backend

# Configurar as chaves TMDB (obtenha em https://www.themoviedb.org/settings/api)
export TMDB_API_KEY_1="sua_chave_1"
export TMDB_API_KEY_2="sua_chave_2"  # opcional
export TMDB_API_KEY_3="sua_chave_3"  # opcional

# Executar o script
npx ts-node scripts/ingest-tmdb-data.ts
```

Ou em uma unica linha:

```bash
TMDB_API_KEY_1=xxx TMDB_API_KEY_2=yyy TMDB_API_KEY_3=zzz npx ts-node scripts/ingest-tmdb-data.ts
```

#### Tempo Estimado

- ~2-3 horas para processar 500 filmes + 500 series
- Inclui delays para respeitar rate limits

### 2. `ingest-movie-data.ts` (Alternativo)

Script alternativo que usa APIs gratuitas sem necessidade de chave TMDB:
- **OMDb API** - Dados basicos de filmes/series
- **TVMaze API** - Dados detalhados de series

#### Como Executar

```bash
cd backend
OMDB_API_KEY=sua_chave npx ts-node scripts/ingest-movie-data.ts
```

Para obter uma chave OMDb gratuita: https://www.omdbapi.com/apikey.aspx

## Estrutura do Banco de Dados

### Tabelas Principais

- `Content` - Filmes e series
- `Season` - Temporadas de series
- `Episode` - Episodios de series
- `Person` - Atores, diretores, criadores
- `Credit` - Relacao entre conteudo e pessoas
- `Genre` - Generos (Acao, Comedia, Drama, etc.)
- `ContentGenre` - Relacao N:N entre conteudo e generos
- `ContentImage` - Imagens adicionais (poster, backdrop, logo)
- `ExternalId` - IDs externos (IMDB, TVMaze, etc.)

### Campos de Content

| Campo | Tipo | Descricao |
|-------|------|-----------|
| id | Int | ID interno |
| tmdbId | Int | ID do TMDB |
| imdbId | String | ID do IMDB (tt...) |
| tvmazeId | Int | ID do TVMaze |
| title | String | Titulo em portugues |
| originalTitle | String | Titulo original |
| type | String | 'movie' ou 'series' |
| overview | String | Sinopse |
| posterPath | String | URL do poster |
| backdropPath | String | URL do backdrop |
| logoPath | String | URL do logo |
| trailerUrl | String | URL do trailer (YouTube) |
| releaseDate | String | Data de lancamento |
| runtime | Int | Duracao em minutos |
| voteAverage | Float | Nota media (0-10) |
| voteCount | Int | Numero de votos |
| genres | String | Generos separados por virgula |
| country | String | Pais de origem |
| language | String | Idioma original |
| popularity | Float | Indice de popularidade |

### Campos de Credit

| Campo | Tipo | Descricao |
|-------|------|-----------|
| contentId | Int | FK para Content |
| personId | Int | FK para Person |
| department | String | Acting, Directing, Writing, Creator |
| job | String | Actor, Director, Writer, etc. |
| character | String | Nome do personagem (para atores) |
| creditOrder | Int | Ordem nos creditos |

## Atualizacao de Dados

Para atualizar dados existentes, basta executar o script novamente. Ele:
- Verifica se o conteudo ja existe (por tmdbId ou titulo)
- Atualiza registros existentes com novos dados
- Mantem imagens existentes se ja houver
- Adiciona novos registros quando nao existirem

## Notas Importantes

1. **Imagens**: O script usa URLs do TMDB para imagens. Para armazenar localmente, use o script de upload para Supabase Storage.

2. **Rate Limits**: O script inclui delays automaticos para respeitar os limites das APIs.

3. **Erros**: Erros individuais sao logados mas nao interrompem o processamento.

4. **Duplicatas**: O script trata duplicatas automaticamente usando IDs externos.
