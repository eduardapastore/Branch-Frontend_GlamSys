const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rotas
const loginRoutes = require('./login');
app.use('/login', loginRoutes);
const servRoutes = require('./routes/servico/servicos');
app.use('/servicos', servRoutes);
const colabRoutes = require('./routes/RH/colaboradores');
app.use('/colaboradores', colabRoutes);
const agendRoutes = require('./routes/servico/agendamentos');
app.use('/agendamentos', agendRoutes);
const produtosRoutes = require('./routes/estoque/produtos');
app.use('/produtos', produtosRoutes);
const estoqueRoutes = require('./routes/estoque/estoques');
app.use('/estoques', estoqueRoutes);
const mpagamentoRoutes = require('./routes/financeiro/meios_pagamento');
app.use('/meios_pagamento', mpagamentoRoutes);
const cfinanceirasRoutes = require('./routes/financeiro/contas_financeiras');
app.use('/contas_financeiras', cfinanceirasRoutes);
const lancamentosRoutes = require('./routes/financeiro/lancamentos');
app.use('/lancamentos', lancamentosRoutes);
const tlancamentosRoutes = require('./routes/financeiro/tipo_lancamento');
app.use('/tipo_lancamento', tlancamentosRoutes);
const fornecedoresRoutes = require('./routes/estoque/fornecedores');
app.use('/fornecedores', fornecedoresRoutes);
const clienteRoutes = require('./routes/servico/cliente');
app.use('/cliente', clienteRoutes);
const ordensservRoutes = require('./routes/servico/ordens_servico');
app.use('/ordens_servico', ordensservRoutes);
const PagcolabRoutes = require('./routes/RH/pagColaboradores');
app.use('/pagColaboradores', PagcolabRoutes);



const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


