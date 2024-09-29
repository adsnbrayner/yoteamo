// Atualiza a pré-visualização em tempo real
document.getElementById('coupleName').addEventListener('input', function() {
    document.getElementById('previewName').textContent = this.value || 'Nome do Casal';
});

document.getElementById('loveText').addEventListener('input', function() {
    document.getElementById('previewText').textContent = this.value || 'Texto de amor aqui...';
});

document.getElementById('relationshipDate').addEventListener('input', function() {
    const startDate = new Date(this.value);
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    document.getElementById('previewDate').textContent = `Início do Relacionamento: ${startDate.toLocaleString('pt-BR', options)}`;
    updateTimeTogether(startDate);
});

// Adiciona a pré-visualização das fotos
document.getElementById('photoUpload').addEventListener('change', function(event) {
    const files = event.target.files;
    const previewPhotos = document.getElementById('previewPhotos');
    previewPhotos.innerHTML = ''; // Limpa fotos anteriores

    const photoUrls = []; // Array para armazenar URLs das fotos

    for (let i = 0; i < files.length && i < 5; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            previewPhotos.appendChild(img);
            photoUrls.push(e.target.result); // Armazena a URL da foto
        }
        reader.readAsDataURL(files[i]);
    }

    // Salvar URLs das fotos no localStorage
    localStorage.setItem('photoUrls', JSON.stringify(photoUrls));
});

// Função para atualizar o tempo juntos na pré-visualização
function updateTimeTogether(startDate) {
    const interval = setInterval(() => {
        const now = new Date();
        const diff = now - startDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);
        document.getElementById('previewTimeTogether').textContent = `${years} anos, ${months % 12} meses, ${days % 30} dias`;
    }, 1000);
}

// Gera a página do casal
document.getElementById('generateButton').addEventListener('click', function() {
    const coupleName = document.getElementById('coupleName').value;
    const loveText = document.getElementById('loveText').value;
    const relationshipDate = new Date(document.getElementById('relationshipDate').value);
    const photoUrls = JSON.parse(localStorage.getItem('photoUrls')) || [];

    fetch('/.netlify/functions/createCouplePage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            coupleName,
            loveText,
            relationshipDate: relationshipDate.toISOString(),
            photos: photoUrls,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        alert(`Página criada! Acesse aqui: ${data.url}`);
    })
    .catch((error) => {
        console.error('Erro:', error);
    });
});

