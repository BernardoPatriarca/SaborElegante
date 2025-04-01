// Configuração do Supabase
const SUPABASE_URL = 'https://tinpittfpscsftxotbvs.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpbnBpdHRmcHNjc2Z0eG90YnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MjI2NjQsImV4cCI6MjA1OTA5ODY2NH0.Eqnorc-Az7JEN5fLaBfsE0mZNf5tASOcrVLcLfmzUuA';

// Função para inicializar o Supabase
async function initSupabase() {
    try {
        // Cria o cliente Supabase
        const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        
        // Testa a conexão
        const { data, error } = await supabaseClient
            .from('produto')
            .select('*')
            .limit(1);
        
        if (error) throw error;
        
        return supabaseClient;
    } catch (error) {
        console.error('Erro ao conectar com Supabase:', error);
        throw error;
    }
}

// Função para criar confetes
function createConfetti() {
    const colors = ['#D4AF37', '#E8D9A0', '#FFFFFF', '#1A3A5F', '#2A4E77'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(confetti);
        
        // Remove o confete após a animação terminar
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

// Função para animar as seções ao rolar
function animateOnScroll() {
    const sections = document.querySelectorAll('.animate-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Função para preencher o cardápio
async function fillMenu(supabaseClient) {
    try {
        // Busca todos os produtos de uma vez
        const { data: produtos, error } = await supabaseClient
            .from('produto')
            .select('*')
            .order('nome', { ascending: true });

        if (error) throw error;
        console.log('Produtos recebidos:', produtos);

        if (!produtos || produtos.length === 0) {
            console.log('Nenhum produto encontrado no banco de dados');
            showNoProductsMessage();
            return;
        }

        // Separa os produtos por categoria
        const produtosPorCategoria = {
            entradas: produtos.filter(p => p.categoria_id === 1),
            carnes: produtos.filter(p => p.categoria_id === 5),
            frutos: produtos.filter(p => p.categoria_id === 6),
            massas: produtos.filter(p => p.categoria_id === 7),
            vegetariano: produtos.filter(p => p.categoria_id === 8),
            sobremesas: produtos.filter(p => p.categoria_id === 3),
            bebidas: produtos.filter(p => p.categoria_id === 4)
        };

        // Preenche cada seção do cardápio
        fillMenuSection('entradas-container', produtosPorCategoria.entradas);
        fillMenuSection('carnes-container', produtosPorCategoria.carnes);
        fillMenuSection('frutos-container', produtosPorCategoria.frutos);
        fillMenuSection('massas-container', produtosPorCategoria.massas);
        fillMenuSection('vegetariano-container', produtosPorCategoria.vegetariano);
        fillMenuSection('sobremesas-container', produtosPorCategoria.sobremesas);
        fillMenuSection('bebidas-container', produtosPorCategoria.bebidas);

    } catch (error) {
        console.error('Erro ao carregar o cardápio:', error);
        alert('Erro ao carregar o cardápio. Por favor, recarregue a página.');
    }
}

// Função para preencher uma seção específica do cardápio
function fillMenuSection(containerId, produtos) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Elemento #${containerId} não encontrado`);
        return;
    }

    container.innerHTML = '';

    if (!produtos || produtos.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-utensils fa-3x mb-3" style="color: #ccc;"></i>
                <p class="text-muted">Nenhum item disponível nesta categoria no momento</p>
            </div>`;
        return;
    }

    produtos.forEach(produto => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-4';
        
        col.innerHTML = `
            <div class="card h-100">
                ${produto.destaque ? '<span class="badge-destaque">Destaque</span>' : ''}
                <img src="${produto.imagem_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'}" class="card-img-top" alt="${produto.nome}">
                <div class="card-body">
                    <h5 class="card-title">${produto.nome}</h5>
                    <p class="card-text">${produto.descricao || 'Descrição não disponível'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="price">R$ ${produto.valor?.toFixed(2) || '0.00'}</span>
                        <button class="btn btn-sm btn-outline-gold">+ Detalhes</button>
                    </div>
                </div>
            </div>`;
        
        container.appendChild(col);
    });
}

// Mostra mensagem quando não há produtos
function showNoProductsMessage() {
    const containers = [
        'entradas-container', 'carnes-container', 'frutos-container',
        'massas-container', 'vegetariano-container', 'sobremesas-container',
        'bebidas-container'
    ];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-utensils fa-3x mb-3" style="color: #ccc;"></i>
                    <p class="text-muted">Nenhum item disponível nesta categoria no momento</p>
                </div>`;
        }
    });
}

// Função principal
async function initializeApp() {
    try {
        console.log('Iniciando aplicação...');
        
        const supabaseClient = await initSupabase();
        
        // Preenche o cardápio
        await fillMenu(supabaseClient);
        
        // Anima as seções quando aparecem na tela
        animateOnScroll();
        
        // Adiciona efeito de confete ao clicar no botão principal
        document.getElementById('mainButton').addEventListener('click', function(e) {
            createConfetti();
        });
        
        // Formulário de reserva
        document.getElementById('reservationForm').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Reserva enviada com sucesso! Entraremos em contato para confirmação.');
            this.reset();
            createConfetti();
        });

    } catch (error) {
        console.error('Erro na inicialização:', error);
        if (error.code === '42P01') {
            alert('Tabela Produto não encontrada. Verifique se criou a tabela no Supabase.');
        } else {
            alert('Erro ao carregar os dados. Por favor, recarregue a página.');
        }
    }
}

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeApp);