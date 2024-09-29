const fs = require('fs');
const path = require('path');

exports.handler = async (event) => {
    const { coupleName, loveText, relationshipDate, photos } = JSON.parse(event.body);

    const dir = path.join('/tmp', coupleName); // Usar /tmp para salvar no ambiente de execução
    fs.mkdirSync(dir, { recursive: true });

    const newPageContent = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Página do Casal - ${coupleName}</title>
            <style>
                /* Estilos aqui */
            </style>
        </head>
        <body>
            <h1>${coupleName}</h1>
            <p>${loveText}</p>
            <p>Início do Relacionamento: ${new Date(relationshipDate).toLocaleString()}</p>
            <div id="photos"></div>
            <script>
                const photos = ${JSON.stringify(photos)};
                // Código para exibir fotos
            </script>
        </body>
        </html>
    `;

    fs.writeFileSync(path.join(dir, 'index.html'), newPageContent);

    // Aqui você precisaria usar um serviço de hospedagem de arquivos, como AWS S3, para servir o HTML gerado.
    // Por simplicidade, retornamos uma URL fictícia para o exemplo.
    const pageUrl = `https://yoteamo.netlify.app/${coupleName}/index.html`; 

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Página criada com sucesso!', url: pageUrl }),
    };
};
