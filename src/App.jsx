import React, { useState, useEffect, useMemo } from 'react';
import { Package, Users, ShoppingCart, Plus, Search, X, Trash2, AlertTriangle, ChevronRight, Loader2, CheckCircle2, TruckIcon, LineChart, FileText, ClipboardList, ArrowRightCircle, Ban, Pencil, PackageCheck, Camera, ShieldCheck, ShieldAlert, Building2, ClipboardCheck, Warehouse, ArrowLeftRight, Database, ShoppingBag, HandCoins, DownloadCloud, UploadCloud, Scale , LogOut } from 'lucide-react';
import { loadCollection, saveCollectionDelta, saveCollectionFull, loadConfig, saveConfig, migrarDadosAntigosSeNecessario } from './lib/storage';
import { supabase } from './lib/supabaseClient';
import LoginScreen from './LoginScreen';

const CATEGORIAS = ['Inversor', 'Painel', 'Estrutura', 'Cabo', 'Outro'];
const SERIALIZAVEL_PADRAO = { Inversor: true, Painel: false, Estrutura: false, Cabo: false, Outro: false };
const CADASTRO_TABS = ['estoque', 'depositos', 'fornecedores', 'clientes', 'formasRecebimento', 'senhaAprovacao'];
const COMPRAS_TABS = ['transferencias', 'pedidos', 'recebimento', 'balanco', 'pagamentos', 'financeiro'];
const PAGAMENTO_CATEGORIAS_SAIDA = [
  'Salários e encargos', 'Pró-labore / retirada de sócio', 'Aluguel', 'Energia elétrica', 'Água',
  'Internet / Telefone', 'Combustível', 'Manutenção de veículo', 'Contador / Consultoria',
  'Impostos e taxas', 'Marketing / Publicidade', 'Material de escritório', 'Manutenção e reparos', 'Outros',
];
const PAGAMENTO_CATEGORIAS_ENTRADA = [
  'Aporte de sócio', 'Empréstimo recebido', 'Reembolso', 'Rendimento financeiro', 'Venda de ativo', 'Outros',
];
const SETOR_VENDAS_TABS = ['orcamentos', 'vendas', 'expedicao'];

const CATALOGO_ATACADO = [
  {
    "categoria": "Painel",
    "marca": "Placa Tsun / Nplus / OSDA",
    "modelo": "600 wp",
    "potencia": "600 wp",
    "serializado": false,
    "precoVenda": 518.42,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 468.00"
  },
  {
    "categoria": "Painel",
    "marca": "Placa Tsun / Nplus / OSDA",
    "modelo": "590 wp",
    "potencia": "590 wp",
    "serializado": false,
    "precoVenda": 510.11,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 460.20"
  },
  {
    "categoria": "Painel",
    "marca": "Placa Tsun / Nplus / OSDA",
    "modelo": "620 wp",
    "potencia": "620 wp",
    "serializado": false,
    "precoVenda": 535.03,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 483.60"
  },
  {
    "categoria": "Painel",
    "marca": "Placa Tsun / Nplus",
    "modelo": "625 wp",
    "potencia": "625 wp",
    "serializado": false,
    "precoVenda": 539.19,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 487.50"
  },
  {
    "categoria": "Painel",
    "marca": "Placa Tsun / Nplus / OSDA",
    "modelo": "630 wp",
    "potencia": "630 wp",
    "serializado": false,
    "precoVenda": 543.34,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 491.40"
  },
  {
    "categoria": "Painel",
    "marca": "Placa ZNShine",
    "modelo": "650 wp",
    "potencia": "650 wp",
    "serializado": false,
    "precoVenda": 559.95,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 507.00"
  },
  {
    "categoria": "Painel",
    "marca": "Placa Tsun / RenePv",
    "modelo": "700 wp",
    "potencia": "700 wp",
    "serializado": false,
    "precoVenda": 690.95,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 630.00"
  },
  {
    "categoria": "Inversor",
    "marca": "micro SAJ / Deye",
    "modelo": "2.25 kw",
    "potencia": "2.25 kw",
    "serializado": true,
    "precoVenda": 999.82,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 799.86"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ AFCI",
    "modelo": "3 kw",
    "potencia": "3 kw",
    "serializado": true,
    "precoVenda": 1428.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 1142.40"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ AFCI - Minimo 7 placas",
    "modelo": "6 kw",
    "potencia": "6 kw",
    "serializado": true,
    "precoVenda": 2000.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 1600.00"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ",
    "modelo": "7.5 kw",
    "potencia": "7.5 kw",
    "serializado": true,
    "precoVenda": 3182.75,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 2546.20"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ AFCI",
    "modelo": "10 kw",
    "potencia": "10 kw",
    "serializado": true,
    "precoVenda": 3000.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 2400.00"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ AFCI",
    "modelo": "15 kw",
    "potencia": "15 kw",
    "serializado": true,
    "precoVenda": 3880.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 3104.00"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ AFCI",
    "modelo": "20 kw",
    "potencia": "20 kw",
    "serializado": true,
    "precoVenda": 6630.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 5304.00"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ AFCI",
    "modelo": "25 kw",
    "potencia": "25 kw",
    "serializado": true,
    "precoVenda": 6630.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 5304.00"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ AFCI",
    "modelo": "30 kw",
    "potencia": "30 kw",
    "serializado": true,
    "precoVenda": 6630.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 5304.00"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ AFCI",
    "modelo": "36 kw",
    "potencia": "36 kw",
    "serializado": true,
    "precoVenda": 6630.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 5304.00"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ AFCI",
    "modelo": "50 kw",
    "potencia": "50 kw",
    "serializado": true,
    "precoVenda": 6630.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 5304.00"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ AFCI",
    "modelo": "75 kw",
    "potencia": "75 kw",
    "serializado": true,
    "precoVenda": 15000.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 12000.00"
  },
  {
    "categoria": "Inversor",
    "marca": "SAJ AFCI",
    "modelo": "100 kw",
    "potencia": "100 kw",
    "serializado": true,
    "precoVenda": 20000.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 16000.00"
  },
  {
    "categoria": "Inversor",
    "marca": "Goodwe",
    "modelo": "6g kw",
    "potencia": "6g kw",
    "serializado": true,
    "precoVenda": 2375.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 1900.00"
  },
  {
    "categoria": "Inversor",
    "marca": "Solplanet",
    "modelo": "5p kw",
    "potencia": "5p kw",
    "serializado": true,
    "precoVenda": 2375.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 1900.00"
  },
  {
    "categoria": "Inversor",
    "marca": "Solplanet Hibrido",
    "modelo": "6p kw",
    "potencia": "6p kw",
    "serializado": true,
    "precoVenda": 6050.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 5500.00"
  },
  {
    "categoria": "Inversor",
    "marca": "Kehua AFCI",
    "modelo": "25k kw",
    "potencia": "25k kw",
    "serializado": true,
    "precoVenda": 4196.48,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 3796.80"
  },
  {
    "categoria": "Inversor",
    "marca": "Kehua AFCI",
    "modelo": "40k kw",
    "potencia": "40k kw",
    "serializado": true,
    "precoVenda": 5916.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 5360.00"
  },
  {
    "categoria": "Inversor",
    "marca": "Deye",
    "modelo": "3D kw",
    "potencia": "3D kw",
    "serializado": true,
    "precoVenda": 1250.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 1000.00"
  },
  {
    "categoria": "Inversor",
    "marca": "Deye",
    "modelo": "6D kw",
    "potencia": "6D kw",
    "serializado": true,
    "precoVenda": 1530.79,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 1224.63"
  },
  {
    "categoria": "Inversor",
    "marca": "Deye",
    "modelo": "7.5D kw",
    "potencia": "7.5D kw",
    "serializado": true,
    "precoVenda": 2400.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 1920.00"
  },
  {
    "categoria": "Inversor",
    "marca": "Deye",
    "modelo": "10D kw",
    "potencia": "10D kw",
    "serializado": true,
    "precoVenda": 2400.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 1920.00"
  },
  {
    "categoria": "Inversor",
    "marca": "Deye trifásico",
    "modelo": "15D kw",
    "potencia": "15D kw",
    "serializado": true,
    "precoVenda": 2690.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 2152.00"
  },
  {
    "categoria": "Inversor",
    "marca": "Deye trifásico",
    "modelo": "25D kw",
    "potencia": "25D kw",
    "serializado": true,
    "precoVenda": 3610.81,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 2888.65"
  },
  {
    "categoria": "Inversor",
    "marca": "Deye trifásico",
    "modelo": "75D kw",
    "potencia": "75D kw",
    "serializado": true,
    "precoVenda": 9600.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 7680.00"
  },
  {
    "categoria": "Cabo",
    "marca": "Cabo DC Vermelho",
    "modelo": "4mm",
    "potencia": "4mm",
    "serializado": false,
    "precoVenda": 4.8,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 3.84"
  },
  {
    "categoria": "Cabo",
    "marca": "Cabo DC Preto",
    "modelo": "4mm",
    "potencia": "4mm",
    "serializado": false,
    "precoVenda": 4.8,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 3.84"
  },
  {
    "categoria": "Cabo",
    "marca": "Cabo DC Vermelho",
    "modelo": "6mm",
    "potencia": "6mm",
    "serializado": false,
    "precoVenda": 6.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 4.80"
  },
  {
    "categoria": "Cabo",
    "marca": "Cabo DC Preto",
    "modelo": "6mm",
    "potencia": "6mm",
    "serializado": false,
    "precoVenda": 6.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 4.80"
  },
  {
    "categoria": "Cabo",
    "marca": "Casal Mc4",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 7.5,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 5.00"
  },
  {
    "categoria": "Outro",
    "marca": "String Box 1E/1S clamper p/1mppt",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 575.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 460.00"
  },
  {
    "categoria": "Outro",
    "marca": "String Box 4E/2S clamper p/2mppt",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 812.5,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 650.00"
  },
  {
    "categoria": "Outro",
    "marca": "String Box 3E/3S clamper p/3mppt",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 1125.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 900.00"
  },
  {
    "categoria": "Outro",
    "marca": "String Box 4E/4S ABB p/2mppt",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 1500.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 1200.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "kit Terminal",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 7.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 6.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "kit Intermediário",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 7.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 4.15"
  },
  {
    "categoria": "Estrutura",
    "marca": "Emenda Perfil",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 18.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 15.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "Régua H Senio T 2,40m",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 79.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 70.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "mini trilho T 54cm ou 42cm",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 10.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 8.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "mini trilho T 25cm ou 20cm",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 5.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 4.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "Gancho Aluminio",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 30.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 25.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "Parafuso Estrutural Galvanizado",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 19.9,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 8.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "Parafuso Estrutural Inox",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 19.9,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 8.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "Kit Galvanizado SolarAço 2,40m",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 283.64,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 241.09"
  },
  {
    "categoria": "Estrutura",
    "marca": "Kit mini trilho 4 placas",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 140.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 112.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "Régua Tipo C 2,40m ou 2,70m",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 64.8,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 48.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "Kit Inox Fibro / Madeira",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 129.6,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 96.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "Tipo C 4 réguas 2,36 + kit Inox fibro madeira",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 360.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 288.00"
  },
  {
    "categoria": "Estrutura",
    "marca": "Estrutura Solo Galvanizada",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 4990.0,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 3000.00"
  },
  {
    "categoria": "Outro",
    "marca": "Front Box 25A ou 32A mono",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 350.87,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 259.90"
  },
  {
    "categoria": "Outro",
    "marca": "Front Box 40A mono",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 404.87,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 299.90"
  },
  {
    "categoria": "Outro",
    "marca": "Front Box 50A Trifásica",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 580.5,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 430.00"
  },
  {
    "categoria": "Outro",
    "marca": "Mobi Box 40A para Wallbox DR tipo A",
    "modelo": "Padrão",
    "potencia": "",
    "serializado": false,
    "precoVenda": 592.5,
    "quantidadeMinima": 0,
    "observacoes": "Custo de compra referência (planilha Propostas, Atacado): R$ 438.89"
  }
];

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function currency(v) {
  return (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
// Descrição completa do produto (marca + modelo + potência), usada em todo lugar que referencia um produto
function descricaoProduto(p) {
  if (!p) return '';
  const base = [p.marca, p.modelo].filter(Boolean).join(' ');
  return p.potencia ? `${base} (${p.potencia})` : base;
}
// Aceita valor digitado com vírgula (padrão BR) ou ponto como separador decimal
function parseValorBR(v) {
  if (v === null || v === undefined || v === '') return NaN;
  return parseFloat(String(v).trim().replace(',', '.'));
}
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

function availableQty(item, depositoId) {
  if (!item) return 0;
  if (item.serializado) return (item.unidades || []).filter(u => u.status === 'Disponível' && (!depositoId || u.depositoId === depositoId)).length;
  return (item.lotes || []).filter(l => !depositoId || l.depositoId === depositoId).reduce((acc, l) => acc + l.quantidadeDisponivel, 0);
}

// Produto com quantidade em estoque, mas sem nenhum custo (nem de entrada real, nem de referência) —
// contaria como R$0 no valor do estoque, então precisa de atenção.
function temCustoPendente(item) {
  if (availableQty(item) === 0) return false;
  if ((item.custoReferencia || 0) > 0) return false;
  if (item.serializado) {
    return (item.unidades || []).some(u => u.status === 'Disponível' && !((u.custoCompra || 0) > 0));
  }
  return (item.lotes || []).some(l => l.quantidadeDisponivel > 0 && !((l.custoUnitario || 0) > 0));
}

// Consome estoque (FIFO para não-serializados) para um carrinho de itens de venda/orçamento.
function consumirEstoque(estoqueAtual, carrinho) {
  let novoEstoque = estoqueAtual.map(i => ({
    ...i,
    unidades: i.unidades ? i.unidades.map(u => ({ ...u })) : i.unidades,
    lotes: i.lotes ? i.lotes.map(l => ({ ...l })) : i.lotes,
  }));
  const itensResultado = [];
  const erros = [];

  for (const it of carrinho) {
    const idx = novoEstoque.findIndex(i => i.id === it.itemId);
    if (idx === -1) { erros.push(`${it.descricao}: produto não encontrado`); continue; }
    let custoTotal = 0;
    let itemFinal = it;

    if (it.unidadeId) {
      const uIdx = novoEstoque[idx].unidades.findIndex(u => u.id === it.unidadeId);
      if (uIdx === -1 || novoEstoque[idx].unidades[uIdx].status !== 'Disponível') {
        erros.push(`${it.descricao} (SN ${it.serial}): unidade não está mais disponível`);
        continue;
      }
      custoTotal = novoEstoque[idx].unidades[uIdx].custoCompra > 0 ? novoEstoque[idx].unidades[uIdx].custoCompra : (novoEstoque[idx].custoReferencia || 0);
      novoEstoque[idx].unidades[uIdx].status = 'Vendido';
    } else if (novoEstoque[idx].serializado) {
      // Nenhuma série foi escolhida na venda: atribui automaticamente a unidade mais antiga
      // disponível no depósito (FIFO). O número exato é conferido depois, na expedição.
      const disponiveis = novoEstoque[idx].unidades
        .filter(u => u.status === 'Disponível' && u.depositoId === it.depositoId)
        .sort((a, b) => new Date(a.dataEntrada) - new Date(b.dataEntrada));
      if (disponiveis.length === 0) {
        erros.push(`${it.descricao}: nenhuma unidade disponível em ${it.depositoNome || 'depósito selecionado'}`);
        continue;
      }
      const escolhida = disponiveis[0];
      const uIdx = novoEstoque[idx].unidades.findIndex(u => u.id === escolhida.id);
      custoTotal = novoEstoque[idx].unidades[uIdx].custoCompra > 0 ? novoEstoque[idx].unidades[uIdx].custoCompra : (novoEstoque[idx].custoReferencia || 0);
      novoEstoque[idx].unidades[uIdx].status = 'Vendido';
      itemFinal = { ...it, unidadeId: escolhida.id, serial: escolhida.serial };
    } else {
      const lotesDoDeposito = novoEstoque[idx].lotes.filter(l => l.depositoId === it.depositoId);
      const disponivel = lotesDoDeposito.reduce((acc, l) => acc + l.quantidadeDisponivel, 0);
      if (disponivel < it.quantidade) {
        erros.push(`${it.descricao}: apenas ${disponivel} disponível(is) em ${it.depositoNome || 'depósito selecionado'}, pedido ${it.quantidade}`);
        continue;
      }
      let restante = it.quantidade;
      const lotesOrdenados = lotesDoDeposito.slice().sort((a, b) => new Date(a.dataEntrada) - new Date(b.dataEntrada));
      const loteConsumos = [];
      for (const lote of lotesOrdenados) {
        if (restante <= 0) break;
        if (lote.quantidadeDisponivel <= 0) continue;
        const consumo = Math.min(lote.quantidadeDisponivel, restante);
        const custoUnitarioEfetivo = lote.custoUnitario > 0 ? lote.custoUnitario : (novoEstoque[idx].custoReferencia || 0);
        custoTotal += consumo * custoUnitarioEfetivo;
        lote.quantidadeDisponivel -= consumo;
        restante -= consumo;
        loteConsumos.push({ loteId: lote.id, quantidade: consumo });
      }
      novoEstoque[idx].lotes = novoEstoque[idx].lotes.map(l => lotesOrdenados.find(lo => lo.id === l.id) || l);
      itemFinal = { ...it, loteConsumos };
    }
    itensResultado.push({ ...itemFinal, custoTotal, precoVendaTotal: it.precoVendaUnitario * it.quantidade });
  }

  const totalCusto = itensResultado.reduce((acc, i) => acc + i.custoTotal, 0);
  return { novoEstoque, itensResultado, totalCusto, erros };
}

// Desfaz o consumo de estoque de uma venda apagada: devolve unidades ao status "Disponível"
// e devolve quantidade aos lotes de onde saíram.
function reverterConsumoEstoque(estoqueAtual, itens) {
  let novoEstoque = estoqueAtual.map(i => ({
    ...i,
    unidades: i.unidades ? i.unidades.map(u => ({ ...u })) : i.unidades,
    lotes: i.lotes ? i.lotes.map(l => ({ ...l })) : i.lotes,
  }));

  for (const it of itens) {
    const idx = novoEstoque.findIndex(i => i.id === it.itemId);
    if (idx === -1) continue;
    if (it.unidadeId) {
      const uIdx = novoEstoque[idx].unidades.findIndex(u => u.id === it.unidadeId);
      if (uIdx !== -1 && novoEstoque[idx].unidades[uIdx].status === 'Vendido') {
        novoEstoque[idx].unidades[uIdx] = { ...novoEstoque[idx].unidades[uIdx], status: 'Disponível' };
      }
    } else if (it.loteConsumos) {
      for (const lc of it.loteConsumos) {
        const lIdx = novoEstoque[idx].lotes.findIndex(l => l.id === lc.loteId);
        if (lIdx !== -1) {
          novoEstoque[idx].lotes[lIdx] = { ...novoEstoque[idx].lotes[lIdx], quantidadeDisponivel: novoEstoque[idx].lotes[lIdx].quantidadeDisponivel + lc.quantidade };
        }
      }
    }
  }
  return novoEstoque;
}

function fileToCompressedDataUrl(file, maxDimension = 1280, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maiorLado = Math.max(img.width, img.height);
        const scale = Math.min(1, maxDimension / maiorLado);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Lê qualquer arquivo (ex: PDF) como data URL, sem comprimir — usado para comprovantes de pagamento
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Desenha um documento (orçamento/recibo) num canvas — layout genérico reutilizável
function desenharDocumento({ titulo, numeroLabel, numero, data, cliente, clienteLabel = 'Cliente', itens, totalLabel, totalValor, extraLinhas, observacoes }) {
  const largura = 900;
  const margem = 50;
  const larguraUtil = largura - margem * 2;
  const linhaAltura = 26;
  const alturaCabecalho = 100;
  const alturaCliente = 90;
  const alturaTabelaCabecalho = 30;
  const alturaItens = Math.max(1, itens.length) * linhaAltura;
  const alturaTotal = 50;
  const alturaExtras = extraLinhas && extraLinhas.length ? (extraLinhas.length * 18 + 40) : 0;
  const alturaObs = observacoes ? 40 : 0;
  const alturaRodape = 50;
  const altura = alturaCabecalho + alturaCliente + alturaTabelaCabecalho + alturaItens + alturaTotal + alturaExtras + alturaObs + alturaRodape + margem;

  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, largura, altura);

  let y = margem;

  ctx.fillStyle = '#f59e0b';
  ctx.fillRect(margem, y, 40, 40);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 15px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('EM', margem + 20, y + 26);
  ctx.textAlign = 'left';

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 18px Arial';
  ctx.fillText('Estação Mossoró', margem + 55, y + 18);
  ctx.font = '11px Arial';
  ctx.fillStyle = '#64748b';
  ctx.fillText('Sistema de Gestão · Solar & Elétrica', margem + 55, y + 34);

  ctx.textAlign = 'right';
  ctx.font = 'bold 16px Arial';
  ctx.fillStyle = '#0f172a';
  ctx.fillText(titulo, largura - margem, y + 16);
  ctx.font = '12px Arial';
  ctx.fillStyle = '#64748b';
  ctx.fillText(`${numeroLabel}: ${numero}`, largura - margem, y + 34);
  ctx.fillText(`Data: ${data}`, largura - margem, y + 50);
  ctx.textAlign = 'left';

  y += alturaCabecalho;
  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath(); ctx.moveTo(margem, y); ctx.lineTo(largura - margem, y); ctx.stroke();
  y += 25;

  ctx.font = 'bold 12px Arial';
  ctx.fillStyle = '#334155';
  ctx.fillText(clienteLabel, margem, y);
  y += 20;
  ctx.font = '13px Arial';
  ctx.fillStyle = '#0f172a';
  ctx.fillText(cliente.nome || '', margem, y);
  y += 18;
  ctx.font = '11px Arial';
  ctx.fillStyle = '#64748b';
  const linhaContato = [cliente.documento, cliente.telefone, cliente.cidade].filter(Boolean).join('  ·  ');
  if (linhaContato) { ctx.fillText(linhaContato, margem, y); y += 16; }
  if (cliente.endereco) { ctx.fillText(cliente.endereco, margem, y); y += 16; }
  y += 12;

  const colDescX = margem + 10;
  const colQtdX = margem + larguraUtil - 260;
  const colPrecoX = margem + larguraUtil - 165;
  const colSubtotalX = margem + larguraUtil - 10;

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(margem, y, larguraUtil, alturaTabelaCabecalho);
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 11px Arial';
  ctx.fillText('Descrição', colDescX, y + 19);
  ctx.fillText('Qtd', colQtdX, y + 19);
  ctx.fillText('Preço unit.', colPrecoX, y + 19);
  ctx.textAlign = 'right';
  ctx.fillText('Subtotal', colSubtotalX, y + 19);
  ctx.textAlign = 'left';
  y += alturaTabelaCabecalho;

  ctx.font = '11px Arial';
  itens.forEach((it, idx) => {
    if (idx % 2 === 1) { ctx.fillStyle = '#f8fafc'; ctx.fillRect(margem, y, larguraUtil, linhaAltura); }
    ctx.fillStyle = '#0f172a';
    let desc = it.descricao || '';
    if (desc.length > 58) desc = desc.slice(0, 55) + '...';
    ctx.fillText(desc, colDescX, y + 17);
    ctx.fillText(String(it.quantidade), colQtdX, y + 17);
    ctx.fillText(currency(it.precoUnitario), colPrecoX, y + 17);
    ctx.textAlign = 'right';
    ctx.fillText(currency(it.subtotal), colSubtotalX, y + 17);
    ctx.textAlign = 'left';
    y += linhaAltura;
  });

  ctx.strokeStyle = '#e2e8f0';
  ctx.beginPath(); ctx.moveTo(margem, y); ctx.lineTo(largura - margem, y); ctx.stroke();
  y += 32;

  ctx.font = 'bold 15px Arial';
  ctx.fillStyle = '#0f172a';
  ctx.textAlign = 'right';
  ctx.fillText(`${totalLabel}: ${currency(totalValor)}`, largura - margem, y);
  ctx.textAlign = 'left';
  y += 26;

  if (extraLinhas && extraLinhas.length) {
    ctx.font = 'bold 11px Arial';
    ctx.fillStyle = '#334155';
    ctx.fillText('Formas de pagamento', margem, y);
    y += 18;
    ctx.font = '11px Arial';
    ctx.fillStyle = '#64748b';
    extraLinhas.forEach(l => { ctx.fillText(l, margem, y); y += 18; });
    y += 12;
  }

  if (observacoes) {
    ctx.font = 'italic 10px Arial';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(observacoes, margem, y);
    y += 20;
  }

  ctx.font = '9px Arial';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText('Documento gerado pelo Sistema de Gestão — Estação Mossoró', margem, altura - 20);

  return canvas;
}

// Empacota a imagem JPEG do canvas dentro de um PDF de uma página, sem depender de bibliotecas externas
function canvasParaPdfBlob(canvas, quality = 0.92) {
  const dataUrl = canvas.toDataURL('image/jpeg', quality);
  const base64 = dataUrl.split(',')[1];
  const binario = atob(base64);
  const jpegBytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) jpegBytes[i] = binario.charCodeAt(i);

  const largura = canvas.width;
  const altura = canvas.height;
  const enc = new TextEncoder();
  const partes = [];
  const offsets = {};
  let pos = 0;

  function texto(str) { const b = enc.encode(str); partes.push(b); pos += b.length; }
  function bytes(b) { partes.push(b); pos += b.length; }
  function marcar(n) { offsets[n] = pos; }

  texto('%PDF-1.4\n');

  marcar(1); texto('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  marcar(2); texto('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n');
  marcar(3); texto(`3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /XObject << /Im0 4 0 R >> >> /MediaBox [0 0 ${largura} ${altura}] /Contents 5 0 R >>\nendobj\n`);
  marcar(4);
  texto(`4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${largura} /Height ${altura} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`);
  bytes(jpegBytes);
  texto('\nendstream\nendobj\n');

  const conteudo = `q ${largura} 0 0 ${altura} 0 0 cm /Im0 Do Q`;
  marcar(5); texto(`5 0 obj\n<< /Length ${conteudo.length} >>\nstream\n${conteudo}\nendstream\nendobj\n`);

  const xrefInicio = pos;
  let xref = 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 1; i <= 5; i++) xref += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  texto(xref);
  texto(`trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefInicio}\n%%EOF`);

  return new Blob(partes, { type: 'application/pdf' });
}

function baixarBlob(blob, nomeArquivo) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = nomeArquivo;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

function baixarDocumento(dadosDocumento, nomeBase, formato) {
  const canvas = desenharDocumento(dadosDocumento);
  if (formato === 'jpg') {
    canvas.toBlob(blob => baixarBlob(blob, `${nomeBase}.jpg`), 'image/jpeg', 0.92);
  } else {
    baixarBlob(canvasParaPdfBlob(canvas), `${nomeBase}.pdf`);
  }
}

// Chave de um item dentro de uma venda (para saber o que já foi expedido)
function chaveItemVenda(vendaId, item) {
  return `${vendaId}:${item.id || item.unidadeId || `${item.itemId}-${item.descricao}`}`;
}

// Quantidade já recebida de uma linha de pedido de compra
function qtdRecebida(recebimentos, pedidoId, itemLineId) {
  return recebimentos.filter(r => r.pedidoId === pedidoId && r.itemLineId === itemLineId && !r.anulado).reduce((a, r) => a + r.quantidade, 0);
}

function BalancoLockScreen({ senhaCorreta, onDesbloquear }) {
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');

  function confirmar() {
    if (!senhaCorreta) { setErro('Nenhuma senha de aprovação foi cadastrada ainda. Configure em Cadastros → Senha de aprovação.'); return; }
    if (valor !== senhaCorreta) { setErro('Senha incorreta.'); return; }
    onDesbloquear();
  }

  return (
    <div className="flex items-center justify-center py-16">
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 w-full max-w-xs text-center">
        <ShieldAlert size={24} className="text-amber-500 mx-auto mb-2" />
        <h3 className="font-medium text-sm mb-1">Área protegida</h3>
        <p className="text-xs text-slate-500 mb-4">Digite a senha de aprovação para acessar o Balanço de Estoque. Depois de desbloquear, não será pedida de novo nesta sessão.</p>
        <input
          type="password"
          autoFocus
          value={valor}
          onChange={e => { setValor(e.target.value); setErro(''); }}
          onKeyDown={e => e.key === 'Enter' && confirmar()}
          placeholder="Senha de aprovação"
          className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm mb-2"
        />
        {erro && <p className="text-xs text-red-500 mb-2">{erro}</p>}
        <button onClick={confirmar} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-4 py-2 rounded-md">Desbloquear</button>
      </div>
    </div>
  );
}

function SenhaDialogModal({ message, senhaCorreta, label = 'Apagar', destrutivo = true, onResolve }) {
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState('');

  function confirmar() {
    if (!senhaCorreta) { setErro('Nenhuma senha de aprovação foi cadastrada ainda. Configure em Cadastros → Senha de aprovação.'); return; }
    if (valor !== senhaCorreta) { setErro('Senha incorreta.'); return; }
    onResolve(true);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-4">
        <div className="flex items-center gap-2 mb-1">
          <ShieldAlert size={16} className={destrutivo ? 'text-red-500' : 'text-amber-500'} />
          <h3 className="font-medium text-sm">Ação protegida por senha</h3>
        </div>
        <p className="text-sm text-slate-700 mt-2">{message}</p>
        <input
          type="password"
          autoFocus
          value={valor}
          onChange={e => { setValor(e.target.value); setErro(''); }}
          onKeyDown={e => e.key === 'Enter' && confirmar()}
          placeholder="Senha de aprovação"
          className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm mt-3"
        />
        {erro && <p className="text-xs text-red-500 mt-1">{erro}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => onResolve(false)} className="text-sm px-3 py-1.5 rounded-md text-slate-500 hover:bg-slate-100">Cancelar</button>
          <button onClick={confirmar} className={`text-sm px-3 py-1.5 rounded-md text-white font-medium ${destrutivo ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600 text-slate-900'}`}>{label}</button>
        </div>
      </div>
    </div>
  );
}

function AppInner() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('estoque');
  const [estoque, setEstoque] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [expedicoes, setExpedicoes] = useState([]);
  const [pedidosCompra, setPedidosCompra] = useState([]);
  const [recebimentos, setRecebimentos] = useState([]);
  const [depositos, setDepositos] = useState([]);
  const [transferencias, setTransferencias] = useState([]);
  const [formasRecebimento, setFormasRecebimento] = useState([]);
  const [senhaAprovacao, setSenhaAprovacao] = useState(null);
  const [pagamentos, setPagamentos] = useState([]);
  const [ajustesReposicao, setAjustesReposicao] = useState([]);
  const [balancos, setBalancos] = useState([]);
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null); // { message, resolve }

  function askConfirm(message) {
    return new Promise(resolve => {
      setConfirmDialog({ message, resolve });
    });
  }
  function responderConfirm(valor) {
    if (confirmDialog) confirmDialog.resolve(valor);
    setConfirmDialog(null);
  }

  const [senhaDialog, setSenhaDialog] = useState(null); // { message, resolve }
  const [balancoDesbloqueado, setBalancoDesbloqueado] = useState(false);

  function askSenha(message, options) {
    return new Promise(resolve => {
      setSenhaDialog({ message, resolve, label: options?.label || 'Apagar', destrutivo: options?.destrutivo !== false });
    });
  }

  const [showBackup, setShowBackup] = useState(false);
  const [importando, setImportando] = useState(false);

  function exportarBackup() {
    const dados = {
      versao: 2, exportadoEm: new Date().toISOString(),
      estoque, clientes, fornecedores, vendas, orcamentos, expedicoes, pedidosCompra, recebimentos, depositos, transferencias,
      formasRecebimento, senhaAprovacao, pagamentos, ajustesReposicao, balancos,
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-sgm-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    notify('Backup exportado');
  }

  async function importarBackup(file) {
    setImportando(true);
    try {
      const texto = await file.text();
      const dados = JSON.parse(texto);
      if (!(await askConfirm('Importar este backup vai SUBSTITUIR todos os dados atuais (estoque, vendas, clientes etc.) pelos dados do arquivo. Confirmar?'))) { setImportando(false); return; }
      await persistEstoque(dados.estoque || []);
      await persistClientes(dados.clientes || []);
      await persistFornecedores(dados.fornecedores || []);
      await persistVendas(dados.vendas || []);
      await persistOrcamentos(dados.orcamentos || []);
      await persistExpedicoes(dados.expedicoes || []);
      await persistPedidosCompra(dados.pedidosCompra || []);
      await persistRecebimentos(dados.recebimentos || []);
      await persistDepositos(dados.depositos || []);
      await persistTransferencias(dados.transferencias || []);
      await persistFormasRecebimento(dados.formasRecebimento || []);
      await persistPagamentos(dados.pagamentos || []);
      await persistAjustesReposicao(dados.ajustesReposicao || []);
      await persistBalancos(dados.balancos || []);
      if (dados.senhaAprovacao) await persistSenhaAprovacao(dados.senhaAprovacao);
      notify('Backup importado com sucesso');
      setShowBackup(false);
    } catch (e) {
      notify('Não foi possível ler esse arquivo de backup');
    }
    setImportando(false);
  }

  useEffect(() => {
    (async () => {
      await migrarDadosAntigosSeNecessario();
      const [e, c, f, v, or, ex, pc, rc, dp, tr, fr, sa, pg, aj, bl] = await Promise.all([
        loadCollection('estoque', []),
        loadCollection('clientes', []),
        loadCollection('fornecedores', []),
        loadCollection('vendas', []),
        loadCollection('orcamentos', []),
        loadCollection('expedicoes', []),
        loadCollection('pedidosCompra', []),
        loadCollection('recebimentos', []),
        loadCollection('depositos', []),
        loadCollection('transferencias', []),
        loadCollection('formasRecebimento', []),
        loadConfig('senhaAprovacao', null),
        loadCollection('pagamentos', []),
        loadCollection('ajustesReposicao', []),
        loadCollection('balancos', []),
      ]);

      // Migração: garante que sempre existe ao menos um depósito, e que todo lote/unidade
      // já existente (de antes do controle por depósito) fique associado a ele.
      let depositosFinal = dp;
      let estoqueFinal = e;
      if (depositosFinal.length === 0) {
        depositosFinal = [{ id: uid(), nome: 'Depósito Principal', endereco: '', observacoes: '' }];
        await saveCollectionFull('depositos', depositosFinal);
      }
      const padraoId = depositosFinal[0].id;
      let mudou = false;
      estoqueFinal = e.map(item => {
        let alterado = false;
        const unidades = item.unidades ? item.unidades.map(u => {
          if (!u.depositoId) { alterado = true; return { ...u, depositoId: padraoId }; }
          return u;
        }) : item.unidades;
        const lotes = item.lotes ? item.lotes.map(l => {
          if (!l.depositoId) { alterado = true; return { ...l, depositoId: padraoId }; }
          return l;
        }) : item.lotes;
        if (alterado) { mudou = true; return { ...item, unidades, lotes }; }
        return item;
      });
      if (mudou) await saveCollectionFull('estoque', estoqueFinal);

      // Migração: corrige a descrição (marca + modelo + potência) de itens já lançados em
      // pedidos, recebimentos e transferências antes dessa informação completa existir.
      const produtoPorId = Object.fromEntries(estoqueFinal.map(p => [p.id, p]));

      let pedidosFinal = pc;
      let pedidosMudou = false;
      pedidosFinal = pc.map(pedido => {
        let alterado = false;
        const itens = pedido.itens.map(it => {
          const produto = produtoPorId[it.produtoId];
          if (produto) {
            const novaDescricao = descricaoProduto(produto);
            if (novaDescricao && novaDescricao !== it.descricao) { alterado = true; return { ...it, descricao: novaDescricao }; }
          }
          return it;
        });
        if (alterado) { pedidosMudou = true; return { ...pedido, itens }; }
        return pedido;
      });
      if (pedidosMudou) await saveCollectionFull('pedidosCompra', pedidosFinal);

      let recebimentosFinal = rc;
      let recebimentosMudou = false;
      recebimentosFinal = rc.map(r => {
        const produto = produtoPorId[r.produtoId];
        if (produto) {
          const novaDescricao = descricaoProduto(produto);
          if (novaDescricao && novaDescricao !== r.descricao) { recebimentosMudou = true; return { ...r, descricao: novaDescricao }; }
        }
        return r;
      });
      if (recebimentosMudou) await saveCollectionFull('recebimentos', recebimentosFinal);

      let transferenciasFinal = tr;
      let transferenciasMudou = false;
      transferenciasFinal = tr.map(t => {
        const produto = produtoPorId[t.produtoId];
        if (produto) {
          const novaDescricao = descricaoProduto(produto);
          if (novaDescricao && novaDescricao !== t.descricao) { transferenciasMudou = true; return { ...t, descricao: novaDescricao }; }
        }
        return t;
      });
      if (transferenciasMudou) await saveCollectionFull('transferencias', transferenciasFinal);

      let formasFinal = fr;
      if (formasFinal.length === 0) {
        formasFinal = [
          'Pix JCL Stone', 'PIx JCL BB', 'Dinheiro', 'PIx Terceiros', 'Pix Senio Com', 'Pix KMX', 'Cartão de Crédito',
        ].map(nome => ({ id: uid(), nome, multipla: false }));
        formasFinal.push({ id: uid(), nome: 'Múltiplas formas de pagamento', multipla: true });
        await saveCollectionFull('formasRecebimento', formasFinal);
      }

      setEstoque(estoqueFinal); setClientes(c); setFornecedores(f); setVendas(v); setOrcamentos(or);
      setExpedicoes(ex); setPedidosCompra(pedidosFinal); setRecebimentos(recebimentosFinal); setDepositos(depositosFinal); setTransferencias(transferenciasFinal);
      setSenhaAprovacao(sa);
      setPagamentos(pg);
      setAjustesReposicao(aj);
      setBalancos(bl);
      setFormasRecebimento(formasFinal);
      setLoading(false);
    })();
  }, []);

  function notify(msg) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  async function persist(collection, setter, next, anterior) {
    setter(next);
    const ok = await saveCollectionDelta(collection, anterior, next);
    if (!ok) notify('⚠️ Não foi possível salvar. Verifique sua conexão e tente novamente.');
  }
  async function persistEstoque(next) { await persist('estoque', setEstoque, next, estoque); }
  async function persistClientes(next) { await persist('clientes', setClientes, next, clientes); }
  async function persistFornecedores(next) { await persist('fornecedores', setFornecedores, next, fornecedores); }
  async function persistVendas(next) { await persist('vendas', setVendas, next, vendas); }
  async function persistOrcamentos(next) { await persist('orcamentos', setOrcamentos, next, orcamentos); }
  async function persistExpedicoes(next) { await persist('expedicoes', setExpedicoes, next, expedicoes); }
  async function persistPedidosCompra(next) { await persist('pedidosCompra', setPedidosCompra, next, pedidosCompra); }
  async function persistRecebimentos(next) { await persist('recebimentos', setRecebimentos, next, recebimentos); }
  async function persistDepositos(next) { await persist('depositos', setDepositos, next, depositos); }
  async function persistTransferencias(next) { await persist('transferencias', setTransferencias, next, transferencias); }
  async function persistFormasRecebimento(next) { await persist('formasRecebimento', setFormasRecebimento, next, formasRecebimento); }
  async function persistSenhaAprovacao(next) {
    setSenhaAprovacao(next);
    const ok = await saveConfig('senhaAprovacao', next);
    if (!ok) notify('⚠️ Não foi possível salvar. Verifique sua conexão e tente novamente.');
  }
  async function persistPagamentos(next) { await persist('pagamentos', setPagamentos, next, pagamentos); }
  async function persistAjustesReposicao(next) { await persist('ajustesReposicao', setAjustesReposicao, next, ajustesReposicao); }
  async function persistBalancos(next) { await persist('balancos', setBalancos, next, balancos); }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="animate-spin" size={20} /><span>Carregando dados...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-10">
      <header className="bg-slate-900 text-white sticky top-0 z-20 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-amber-500 flex items-center justify-center font-bold text-slate-900 text-sm">EM</div>
              <div>
                <h1 className="text-base font-semibold leading-tight">Estação Mossoró</h1>
                <p className="text-xs text-slate-400 leading-tight">Sistema de Gestão</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowBackup(true)} className="flex items-center gap-1 text-xs text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-2.5 py-1.5 rounded-md">
                <DownloadCloud size={14} /> Backup
              </button>
              <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-1 text-xs text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-2.5 py-1.5 rounded-md">
                <LogOut size={14} /> Sair
              </button>
            </div>
          </div>
          <nav className="flex gap-1 mt-3 -mb-3 overflow-x-auto">
            <TabButton icon={Database} label="Cadastros" active={CADASTRO_TABS.includes(tab)} onClick={() => setTab(CADASTRO_TABS.includes(tab) ? tab : 'estoque')} />
            <TabButton icon={ShoppingBag} label="Setor de Compras" active={COMPRAS_TABS.includes(tab)} onClick={() => setTab(COMPRAS_TABS.includes(tab) ? tab : 'pedidos')} />
            <TabButton icon={HandCoins} label="Setor de Vendas" active={SETOR_VENDAS_TABS.includes(tab)} onClick={() => setTab(SETOR_VENDAS_TABS.includes(tab) ? tab : 'orcamentos')} />
          </nav>
        </div>
        {CADASTRO_TABS.includes(tab) && (
          <div className="bg-slate-800 border-t border-slate-700">
            <div className="max-w-6xl mx-auto px-4">
              <nav className="flex gap-1 overflow-x-auto">
                <SubTabButton icon={Package} label="Estoque" active={tab === 'estoque'} onClick={() => setTab('estoque')} />
                <SubTabButton icon={Warehouse} label="Depósitos" active={tab === 'depositos'} onClick={() => setTab('depositos')} />
                <SubTabButton icon={Building2} label="Fornecedores" active={tab === 'fornecedores'} onClick={() => setTab('fornecedores')} />
                <SubTabButton icon={Users} label="Clientes" active={tab === 'clientes'} onClick={() => setTab('clientes')} />
                <SubTabButton icon={HandCoins} label="Formas de recebimento" active={tab === 'formasRecebimento'} onClick={() => setTab('formasRecebimento')} />
                <SubTabButton icon={ShieldAlert} label="Senha de aprovação" active={tab === 'senhaAprovacao'} onClick={() => setTab('senhaAprovacao')} />
              </nav>
            </div>
          </div>
        )}
        {COMPRAS_TABS.includes(tab) && (
          <div className="bg-slate-800 border-t border-slate-700">
            <div className="max-w-6xl mx-auto px-4">
              <nav className="flex gap-1 overflow-x-auto">
                <SubTabButton icon={ArrowLeftRight} label="Transferências" active={tab === 'transferencias'} onClick={() => setTab('transferencias')} />
                <SubTabButton icon={ClipboardList} label="Pedidos de compra" active={tab === 'pedidos'} onClick={() => setTab('pedidos')} />
                <SubTabButton icon={TruckIcon} label="Recebimento" active={tab === 'recebimento'} onClick={() => setTab('recebimento')} />
                <SubTabButton icon={Scale} label="Balanço de estoque" active={tab === 'balanco'} onClick={() => setTab('balanco')} />
                <SubTabButton icon={HandCoins} label="Pagamentos" active={tab === 'pagamentos'} onClick={() => setTab('pagamentos')} />
                <SubTabButton icon={LineChart} label="Financeiro" active={tab === 'financeiro'} onClick={() => setTab('financeiro')} />
              </nav>
            </div>
          </div>
        )}
        {SETOR_VENDAS_TABS.includes(tab) && (
          <div className="bg-slate-800 border-t border-slate-700">
            <div className="max-w-6xl mx-auto px-4">
              <nav className="flex gap-1 overflow-x-auto">
                <SubTabButton icon={ClipboardCheck} label="Orçamentos" active={tab === 'orcamentos'} onClick={() => setTab('orcamentos')} />
                <SubTabButton icon={ShoppingCart} label="Vendas" active={tab === 'vendas'} onClick={() => setTab('vendas')} />
                <SubTabButton icon={PackageCheck} label="Expedição" active={tab === 'expedicao'} onClick={() => setTab('expedicao')} />
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-5">
        {tab === 'estoque' && <EstoqueModule estoque={estoque} setEstoque={persistEstoque} depositos={depositos} askConfirm={askConfirm} askSenha={askSenha} notify={notify} />}
        {tab === 'depositos' && <DepositosModule depositos={depositos} setDepositos={persistDepositos} askConfirm={askConfirm} notify={notify} />}
        {tab === 'transferencias' && (
          <TransferenciasModule
            estoque={estoque} setEstoque={persistEstoque}
            depositos={depositos}
            transferencias={transferencias} setTransferencias={persistTransferencias}
            askSenha={askSenha}
            notify={notify}
          />
        )}
        {tab === 'fornecedores' && <FornecedoresModule fornecedores={fornecedores} setFornecedores={persistFornecedores} askConfirm={askConfirm} notify={notify} />}
        {tab === 'pedidos' && (
          <PedidoCompraModule
            estoque={estoque} setEstoque={persistEstoque}
            fornecedores={fornecedores}
            pedidos={pedidosCompra} setPedidos={persistPedidosCompra}
            recebimentos={recebimentos}
            askConfirm={askConfirm}
            askSenha={askSenha}
            notify={notify}
          />
        )}
        {tab === 'recebimento' && (
          <RecebimentoModule
            pedidos={pedidosCompra} setPedidos={persistPedidosCompra}
            recebimentos={recebimentos} setRecebimentos={persistRecebimentos}
            estoque={estoque} setEstoque={persistEstoque}
            depositos={depositos}
            askSenha={askSenha}
            notify={notify}
          />
        )}
        {tab === 'balanco' && (
          balancoDesbloqueado ? (
            <BalancoModule
              balancos={balancos} setBalancos={persistBalancos}
              estoque={estoque} setEstoque={persistEstoque}
              depositos={depositos}
              askSenha={askSenha}
              notify={notify}
            />
          ) : (
            <BalancoLockScreen senhaCorreta={senhaAprovacao?.senha} onDesbloquear={() => setBalancoDesbloqueado(true)} />
          )
        )}
        {tab === 'clientes' && <ClientesModule clientes={clientes} setClientes={persistClientes} askConfirm={askConfirm} notify={notify} />}
        {tab === 'formasRecebimento' && <FormasRecebimentoModule formasRecebimento={formasRecebimento} setFormasRecebimento={persistFormasRecebimento} askConfirm={askConfirm} notify={notify} />}
        {tab === 'senhaAprovacao' && <SenhaAprovacaoModule senhaAprovacao={senhaAprovacao} setSenhaAprovacao={persistSenhaAprovacao} notify={notify} />}
        {tab === 'orcamentos' && (
          <OrcamentoModule
            orcamentos={orcamentos} setOrcamentos={persistOrcamentos}
            vendas={vendas} setVendas={persistVendas}
            clientes={clientes} estoque={estoque} setEstoque={persistEstoque} depositos={depositos} askConfirm={askConfirm} askSenha={askSenha} notify={notify}
          />
        )}
        {tab === 'vendas' && (
          <VendasModule vendas={vendas} setVendas={persistVendas} clientes={clientes} estoque={estoque} setEstoque={persistEstoque} depositos={depositos} orcamentos={orcamentos} setOrcamentos={persistOrcamentos} formasRecebimento={formasRecebimento} expedicoes={expedicoes} setExpedicoes={persistExpedicoes} askConfirm={askConfirm} askSenha={askSenha} notify={notify} />
        )}
        {tab === 'expedicao' && (
          <ExpedicaoModule vendas={vendas} estoque={estoque} expedicoes={expedicoes} setExpedicoes={persistExpedicoes} notify={notify} />
        )}
        {tab === 'pagamentos' && <PagamentosModule pagamentos={pagamentos} setPagamentos={persistPagamentos} vendas={vendas} askSenha={askSenha} notify={notify} />}
        {tab === 'financeiro' && <FinanceiroModule vendas={vendas} estoque={estoque} pedidosCompra={pedidosCompra} recebimentos={recebimentos} pagamentos={pagamentos} ajustesReposicao={ajustesReposicao} setAjustesReposicao={persistAjustesReposicao} askSenha={askSenha} notify={notify} />}
      </main>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm z-30 max-w-[90vw] text-center">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />{toast}
        </div>
      )}

      {showBackup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-4">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-medium text-sm">Backup dos dados</h3>
              <button onClick={() => setShowBackup(false)}><X size={16} className="text-slate-400" /></button>
            </div>
            <p className="text-xs text-slate-500 mb-3">Publicar uma nova versão do artifact cria um armazenamento novo e vazio. Exporte um backup antes de publicar, e importe logo depois pra não perder nada.</p>
            <button onClick={exportarBackup} className="w-full flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-sm px-3 py-2 rounded-md mb-2">
              <DownloadCloud size={14} /> Exportar backup (.json)
            </button>
            <label className="w-full flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md cursor-pointer">
              <UploadCloud size={14} /> {importando ? 'Importando...' : 'Importar backup (.json)'}
              <input type="file" accept="application/json" className="hidden" disabled={importando} onChange={e => e.target.files[0] && importarBackup(e.target.files[0])} />
            </label>
            <p className="text-[11px] text-red-500 mt-2">Importar substitui todos os dados atuais pelos do arquivo — não tem como desfazer.</p>
          </div>
        </div>
      )}

      {senhaDialog && (
        <SenhaDialogModal
          message={senhaDialog.message}
          senhaCorreta={senhaAprovacao?.senha}
          label={senhaDialog.label}
          destrutivo={senhaDialog.destrutivo}
          onResolve={(v) => { senhaDialog.resolve(v); setSenhaDialog(null); }}
        />
      )}

      {confirmDialog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-4">
            <p className="text-sm text-slate-700">{confirmDialog.message}</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => responderConfirm(false)} className="text-sm px-3 py-1.5 rounded-md text-slate-500 hover:bg-slate-100">Cancelar</button>
              <button onClick={() => responderConfirm(true)} className="text-sm px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium">Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-2 text-sm rounded-t-md whitespace-nowrap border-b-2 transition-colors ${active ? 'border-amber-500 text-white bg-slate-800' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
      <Icon size={15} />{label}
    </button>
  );
}

function SubTabButton({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs whitespace-nowrap border-b-2 transition-colors ${active ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
      <Icon size={13} />{label}
    </button>
  );
}

function StatCard({ label, value, highlight, warn }) {
  return (
    <div className={`rounded-lg p-3 border ${warn ? 'bg-red-50 border-red-200' : highlight ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`text-xl font-semibold ${warn ? 'text-red-600' : 'text-slate-800'}`}>{value}</p>
    </div>
  );
}

// Barra reutilizável de busca + filtro (opcional) + ordenação (opcional)
function FiltroBar({ busca, setBusca, buscaPlaceholder, filtroValue, setFiltro, filtroOptions, ordenacaoValue, setOrdenacao, ordenacaoOptions }) {
  return (
    <div className="flex flex-col gap-2 mb-3">
      <div className="relative">
        <Search size={15} className="absolute left-2.5 top-2.5 text-slate-400" />
        <input value={busca} onChange={e => setBusca(e.target.value)} placeholder={buscaPlaceholder || 'Buscar...'} className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400" />
      </div>
      {(filtroOptions || ordenacaoOptions) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {filtroOptions && (
            <select value={filtroValue} onChange={e => setFiltro(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm">
              {filtroOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          )}
          {ordenacaoOptions && (
            <select value={ordenacaoValue} onChange={e => setOrdenacao(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm">
              {ordenacaoOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- CARRINHO (compartilhado por Vendas e Orçamentos) ---------------- */

function CarrinhoEditor({ estoque, depositos, carrinho, setCarrinho, notify }) {
  const [produtoSel, setProdutoSel] = useState('');
  const [depositoSel, setDepositoSel] = useState(depositos.length === 1 ? depositos[0].id : '');
  const [qtdSel, setQtdSel] = useState(1);
  const [precoSel, setPrecoSel] = useState('');

  const produtoAtual = estoque.find(i => i.id === produtoSel);
  useEffect(() => { if (produtoAtual) setPrecoSel(produtoAtual.precoVenda); }, [produtoSel]);

  const depositosComEstoque = produtoAtual ? depositos.filter(d => availableQty(produtoAtual, d.id) > 0) : [];

  useEffect(() => {
    if (produtoAtual && depositosComEstoque.length === 1) {
      setDepositoSel(depositosComEstoque[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produtoSel]);

  function addItem() {
    if (!produtoAtual || !depositoSel) return;
    const preco = parseValorBR(precoSel) || 0;
    const depositoNome = depositos.find(d => d.id === depositoSel)?.nome || '';
    const qtd = parseInt(qtdSel) || 1;
    if (qtd < 1 || qtd > availableQty(produtoAtual, depositoSel)) { notify('Quantidade indisponível nesse depósito'); return; }
    if (produtoAtual.serializado) {
      // A série exata não é escolhida aqui — é atribuída automaticamente (FIFO) ao finalizar,
      // e confirmada de fato depois, na expedição. Uma linha por unidade.
      const novasLinhas = Array.from({ length: qtd }, () => ({
        id: uid(), itemId: produtoAtual.id, categoria: produtoAtual.categoria,
        descricao: descricaoProduto(produtoAtual), quantidade: 1,
        precoVendaUnitario: preco, depositoId: depositoSel, depositoNome,
      }));
      setCarrinho(c => [...c, ...novasLinhas]);
    } else {
      setCarrinho(c => [...c, { id: uid(), itemId: produtoAtual.id, categoria: produtoAtual.categoria, descricao: descricaoProduto(produtoAtual), quantidade: qtd, precoVendaUnitario: preco, depositoId: depositoSel, depositoNome }]);
    }
    setQtdSel(1);
    setProdutoSel(''); setDepositoSel(depositos.length === 1 ? depositos[0].id : '');
  }

  function removeItem(idx) { setCarrinho(c => c.filter((_, i) => i !== idx)); }
  const total = carrinho.reduce((acc, it) => acc + it.precoVendaUnitario * it.quantidade, 0);

  return (
    <>
      <div className="border border-dashed border-slate-200 rounded-md p-3 space-y-2">
        <p className="text-xs text-slate-500 font-medium">Adicionar produto do estoque</p>
        <select value={produtoSel} onChange={e => { setProdutoSel(e.target.value); setDepositoSel(depositos.length === 1 ? depositos[0].id : ''); }} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm">
          <option value="">Selecione o produto...</option>
          {estoque.map(i => {
            const disp = availableQty(i);
            return <option key={i.id} value={i.id} disabled={disp === 0}>{i.categoria} · {descricaoProduto(i)} ({disp} disp.)</option>;
          })}
        </select>
        {produtoAtual && (
          <select value={depositoSel} onChange={e => setDepositoSel(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm">
            <option value="">Selecione o depósito...</option>
            {depositosComEstoque.map(d => <option key={d.id} value={d.id}>{d.nome} ({availableQty(produtoAtual, d.id)} disp.)</option>)}
          </select>
        )}
        {produtoAtual && depositoSel && (
          <div className="flex flex-col sm:flex-row gap-2">
            <input type="number" min={1} max={availableQty(produtoAtual, depositoSel)} value={qtdSel} onChange={e => setQtdSel(e.target.value)} placeholder="Qtd" className="sm:w-24 border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input type="text" inputMode="decimal" value={precoSel} onChange={e => setPrecoSel(e.target.value)} placeholder="Preço de venda unit. (ex: 518,42)" className="sm:w-40 border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <button type="button" onClick={addItem} className="bg-slate-900 text-white text-sm px-3 py-2 rounded-md">Adicionar</button>
          </div>
        )}
      </div>

      {carrinho.length > 0 && (
        <div className="border border-slate-100 rounded-md divide-y">
          {carrinho.map((it, idx) => (
            <div key={idx} className="flex justify-between items-center px-3 py-2 text-sm">
              <div>
                <p>{it.descricao} {it.serial && <span className="text-xs font-mono text-slate-400">· SN {it.serial}</span>}</p>
                <p className="text-xs text-slate-400">{it.quantidade}x {currency(it.precoVendaUnitario)} {it.depositoNome && <span className="inline-flex items-center gap-0.5">· <Warehouse size={10} className="inline" /> {it.depositoNome}</span>}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{currency(it.precoVendaUnitario * it.quantidade)}</span>
                <button onClick={() => removeItem(idx)}><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center pt-2">
        <span className="text-sm text-slate-500">Total</span>
        <span className="text-lg font-semibold">{currency(total)}</span>
      </div>
    </>
  );
}

/* ---------------- ESTOQUE (catálogo + visão de saldo/custo) ---------------- */

function EstoqueModule({ estoque, setEstoque, depositos, askConfirm, askSenha, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('alfabetica');
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(emptyForm());
  const [editandoPrecoId, setEditandoPrecoId] = useState(null);
  const [novoPreco, setNovoPreco] = useState('');
  const [novoCusto, setNovoCusto] = useState('');

  function abrirEdicaoPreco(item) { setEditandoPrecoId(item.id); setNovoPreco(item.precoVenda); setNovoCusto(item.custoReferencia || ''); }
  function cancelarEdicaoPreco() { setEditandoPrecoId(null); setNovoPreco(''); setNovoCusto(''); }

  async function confirmarAtualizacaoPreco(item) {
    const valorVenda = parseValorBR(novoPreco);
    if (isNaN(valorVenda) || valorVenda < 0) { notify('Informe um preço de venda válido'); return; }
    const valorCusto = novoCusto === '' ? (item.custoReferencia || 0) : parseValorBR(novoCusto);
    if (isNaN(valorCusto) || valorCusto < 0) { notify('Informe um custo de referência válido'); return; }
    if (valorVenda === item.precoVenda && valorCusto === (item.custoReferencia || 0)) { cancelarEdicaoPreco(); return; }
    const registro = {
      data: new Date().toISOString(),
      precoAnterior: item.precoVenda, precoNovo: valorVenda,
      custoAnterior: item.custoReferencia || 0, custoNovo: valorCusto,
    };
    const next = estoque.map(i => i.id === item.id ? { ...i, precoVenda: valorVenda, custoReferencia: valorCusto, historicoPrecos: [registro, ...(i.historicoPrecos || [])] } : i);
    await setEstoque(next);
    notify(`Preço atualizado: venda ${currency(item.precoVenda)} → ${currency(valorVenda)}, custo ref. ${currency(item.custoReferencia || 0)} → ${currency(valorCusto)}`);
    cancelarEdicaoPreco();
  }

  const [editandoProdutoId, setEditandoProdutoId] = useState(null);

  function emptyForm() {
    return { categoria: 'Inversor', marca: '', modelo: '', potencia: '', serializado: true, precoVenda: '', quantidadeMinima: '', observacoes: '' };
  }
  function resetForm() { setForm(emptyForm()); setEditandoProdutoId(null); setShowForm(false); }

  function abrirEdicaoProduto(item) {
    setForm({
      categoria: item.categoria, marca: item.marca, modelo: item.modelo, potencia: item.potencia || '',
      serializado: item.serializado, precoVenda: String(item.precoVenda), quantidadeMinima: String(item.quantidadeMinima || 0),
      observacoes: item.observacoes || '',
    });
    setEditandoProdutoId(item.id);
    setShowForm(true);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.marca || !form.modelo) { notify('Preencha marca e modelo antes de salvar'); return; }
    const precoVenda = parseValorBR(form.precoVenda) || 0;

    if (editandoProdutoId) {
      const atual = estoque.find(i => i.id === editandoProdutoId);
      if (!atual) { notify('Produto não encontrado'); resetForm(); return; }
      const mudouCategoriaSerializado = form.categoria !== atual.categoria || form.serializado !== atual.serializado;
      if (mudouCategoriaSerializado && ((atual.unidades && atual.unidades.length > 0) || (atual.lotes && atual.lotes.length > 0))) {
        notify('Não é possível mudar categoria/tipo de controle de série de um produto que já tem estoque lançado');
        return;
      }
      const historicoPrecos = precoVenda !== atual.precoVenda
        ? [{ data: new Date().toISOString(), precoAnterior: atual.precoVenda, precoNovo: precoVenda }, ...(atual.historicoPrecos || [])]
        : (atual.historicoPrecos || []);
      const atualizado = {
        ...atual,
        categoria: form.categoria, marca: form.marca.trim(), modelo: form.modelo.trim(), potencia: form.potencia.trim(),
        serializado: form.serializado, precoVenda, quantidadeMinima: parseInt(form.quantidadeMinima) || 0,
        observacoes: form.observacoes.trim(), historicoPrecos,
      };
      await setEstoque(estoque.map(i => i.id === editandoProdutoId ? atualizado : i));
      notify('Produto atualizado');
      resetForm();
      return;
    }

    const novo = {
      id: uid(), categoria: form.categoria, marca: form.marca.trim(), modelo: form.modelo.trim(),
      potencia: form.potencia.trim(), serializado: form.serializado,
      precoVenda,
      quantidadeMinima: parseInt(form.quantidadeMinima) || 0,
      observacoes: form.observacoes.trim(),
      unidades: form.serializado ? [] : undefined,
      lotes: form.serializado ? undefined : [],
    };
    await setEstoque([novo, ...estoque]);
    notify('Produto cadastrado. A entrada com custo é feita em Pedidos de compra → Recebimento.');
    resetForm();
  }

  async function handleDelete(id) {
    if (!(await askConfirm('Remover este produto do catálogo?'))) return;
    await setEstoque(estoque.filter(i => i.id !== id));
    notify('Produto removido');
  }

  async function handleImportarCatalogo() {
    const chave = p => `${p.categoria}|${p.marca.toLowerCase().trim()}|${p.modelo.toLowerCase().trim()}`;
    const existentes = new Set(estoque.map(chave));
    const novos = CATALOGO_ATACADO.filter(p => !existentes.has(chave(p)));
    const ignorados = CATALOGO_ATACADO.length - novos.length;
    if (novos.length === 0) { notify('Todos os itens do catálogo já estão cadastrados'); return; }
    if (!(await askSenha(`Importar ${novos.length} produto(s) da planilha Atacado?${ignorados > 0 ? ` (${ignorados} já cadastrado(s) serão ignorados)` : ''}`, { label: 'Importar', destrutivo: false }))) return;
    const criados = novos.map(p => ({
      id: uid(), categoria: p.categoria, marca: p.marca, modelo: p.modelo, potencia: p.potencia,
      serializado: p.serializado, precoVenda: p.precoVenda, quantidadeMinima: p.quantidadeMinima,
      observacoes: p.observacoes, unidades: p.serializado ? [] : undefined, lotes: p.serializado ? undefined : [],
    }));
    await setEstoque([...criados, ...estoque]);
    notify(`${criados.length} produto(s) importado(s) do catálogo Atacado`);
  }

  const filtrado = useMemo(() => {
    const lista = estoque.filter(i => {
      if (filtroCategoria !== 'Todos' && i.categoria !== filtroCategoria) return false;
      return `${i.marca} ${i.modelo} ${i.potencia}`.toLowerCase().includes(busca.toLowerCase());
    });
    const dataUltimaEntrada = item => {
      const datas = item.serializado ? (item.unidades || []).map(u => u.dataEntrada) : (item.lotes || []).map(l => l.dataEntrada);
      return datas.length ? Math.max(...datas.map(d => new Date(d).getTime())) : 0;
    };
    const ordenado = lista.slice().sort((a, b) => {
      switch (ordenacao) {
        case 'alfabetica': return `${a.marca} ${a.modelo}`.localeCompare(`${b.marca} ${b.modelo}`, 'pt-BR');
        case 'categoria': return a.categoria.localeCompare(b.categoria, 'pt-BR') || `${a.marca} ${a.modelo}`.localeCompare(`${b.marca} ${b.modelo}`, 'pt-BR');
        case 'precoDesc': return b.precoVenda - a.precoVenda;
        case 'precoAsc': return a.precoVenda - b.precoVenda;
        case 'valorTotalDesc': return (b.precoVenda * availableQty(b)) - (a.precoVenda * availableQty(a));
        case 'qtdDesc': return availableQty(b) - availableQty(a);
        case 'qtdAsc': return availableQty(a) - availableQty(b);
        case 'estoqueBaixo': return (availableQty(a) - (a.quantidadeMinima || 0)) - (availableQty(b) - (b.quantidadeMinima || 0));
        case 'custoPendente': return (temCustoPendente(b) ? 1 : 0) - (temCustoPendente(a) ? 1 : 0);
        case 'recente': return dataUltimaEntrada(b) - dataUltimaEntrada(a);
        default: return 0;
      }
    });
    return ordenado;
  }, [estoque, filtroCategoria, busca, ordenacao]);

  const resumo = useMemo(() => {
    const totalItens = estoque.length;
    const inversoresDisponiveis = estoque.filter(i => i.categoria === 'Inversor').reduce((acc, i) => acc + availableQty(i), 0);
    const estoqueBaixo = estoque.filter(i => availableQty(i) <= (i.quantidadeMinima || 0)).length;
    const semCusto = estoque.filter(temCustoPendente).length;
    return { totalItens, inversoresDisponiveis, estoqueBaixo, semCusto };
  }, [estoque]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        <StatCard label="Produtos cadastrados" value={resumo.totalItens} />
        <StatCard label="Inversores disponíveis" value={resumo.inversoresDisponiveis} highlight />
        <StatCard label="Estoque baixo" value={resumo.estoqueBaixo} warn={resumo.estoqueBaixo > 0} />
        <StatCard label="Sem custo definido" value={resumo.semCusto} warn={resumo.semCusto > 0} />
      </div>

      <div className="flex flex-col gap-2 mb-3">
        <div className="relative">
          <Search size={15} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por marca ou modelo..." className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm">
            <option>Todos</option>{CATEGORIAS.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={ordenacao} onChange={e => setOrdenacao(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm">
            <option value="alfabetica">Ordem alfabética (A-Z)</option>
            <option value="categoria">Categoria</option>
            <option value="precoDesc">Preço de venda (maior primeiro)</option>
            <option value="precoAsc">Preço de venda (menor primeiro)</option>
            <option value="valorTotalDesc">Valor total em estoque (maior primeiro)</option>
            <option value="qtdDesc">Quantidade disponível (maior primeiro)</option>
            <option value="qtdAsc">Quantidade disponível (menor primeiro)</option>
            <option value="estoqueBaixo">Mais próximos do estoque mínimo primeiro</option>
            <option value="custoPendente">Sem custo definido primeiro (afeta o Financeiro)</option>
            <option value="recente">Entrada mais recente primeiro</option>
          </select>
          <button onClick={() => setShowForm(s => !s)} className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
            <Plus size={16} /> Novo produto
          </button>
          <button onClick={handleImportarCatalogo} className="flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-sm px-3 py-2 rounded-md whitespace-nowrap">
            <ShieldAlert size={14} /> Importar Atacado
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">{editandoProdutoId ? 'Editar produto' : 'Cadastrar produto (sem estoque ainda)'}</h3>
            <button type="button" onClick={resetForm}><X size={16} className="text-slate-400" /></button>
          </div>
          {!editandoProdutoId && <p className="text-xs text-slate-400 -mt-2">A entrada de quantidade e custo é feita via Pedidos de compra → Recebimento.</p>}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select value={form.categoria} onChange={e => setForm(f => ({ ...f, categoria: e.target.value, serializado: SERIALIZAVEL_PADRAO[e.target.value] }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm col-span-2 sm:col-span-1">
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
            <input placeholder="Marca" value={form.marca} onChange={e => setForm(f => ({ ...f, marca: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="Modelo" value={form.modelo} onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="Potência (ex: 5kW)" value={form.potencia} onChange={e => setForm(f => ({ ...f, potencia: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={form.serializado} onChange={e => setForm(f => ({ ...f, serializado: e.target.checked }))} />
            Controlar por número de série (recomendado para inversores)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" inputMode="decimal" placeholder="Preço de venda (R$) ex: 518,42" value={form.precoVenda} onChange={e => setForm(f => ({ ...f, precoVenda: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input type="number" placeholder="Estoque mínimo (alerta)" value={form.quantidadeMinima} onChange={e => setForm(f => ({ ...f, quantidadeMinima: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
          </div>
          <input placeholder="Observações" value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
          <button type="button" onClick={handleAdd} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800">{editandoProdutoId ? 'Salvar alterações' : 'Salvar produto'}</button>
        </div>
      )}

      <div className="space-y-2">
        {filtrado.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum produto encontrado.</p>}
        {filtrado.map(item => {
          const disp = availableQty(item);
          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => setExpanded(x => ({ ...x, [item.id]: !x[item.id] }))}>
                <div className="flex items-center gap-2 min-w-0">
                  <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expanded[item.id] ? 'rotate-90' : ''}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{item.categoria}</span>
                      <span className="font-medium text-sm truncate">{item.marca} {item.modelo}</span>
                      {temCustoPendente(item) && (
                        <span className="flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-red-100 text-red-600 shrink-0" title="Tem quantidade em estoque, mas nenhum custo (real ou de referência) — está contando R$0 no Financeiro">
                          <AlertTriangle size={10} /> sem custo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{item.potencia} · venda {currency(item.precoVenda)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs ${disp <= (item.quantidadeMinima || 0) ? 'text-red-500 font-medium flex items-center gap-1' : 'text-slate-500'}`}>
                    {disp <= (item.quantidadeMinima || 0) && <AlertTriangle size={12} />}{disp} disp.
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); abrirEdicaoProduto(item); }} title="Editar produto"><Pencil size={14} className="text-slate-300 hover:text-slate-600" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} title="Remover produto"><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
                </div>
              </div>
              {expanded[item.id] && (
                <div className="border-t border-slate-100 px-3 py-2 bg-slate-50">
                  <div className="bg-white border border-slate-200 rounded-md px-3 py-2 mb-2">
                    {editandoPrecoId === item.id ? (
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 shrink-0 w-32">Preço de venda:</span>
                          <input type="text" inputMode="decimal" autoFocus value={novoPreco} onChange={e => setNovoPreco(e.target.value)} placeholder="Ex: 518,42" className="border border-slate-200 rounded-md px-2 py-1 text-sm w-28" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 shrink-0 w-32">Custo de referência:</span>
                          <input type="text" inputMode="decimal" value={novoCusto} onChange={e => setNovoCusto(e.target.value)} placeholder="Ex: 468,00" className="border border-slate-200 rounded-md px-2 py-1 text-sm w-28" />
                        </div>
                        <p className="text-[10px] text-slate-400">Se o produto já tem lote/unidade recebido normalmente, o custo real desses continua valendo nas vendas. Esse campo só entra em ação como custo de itens de estoque antigo lançados via Balanço de Estoque (sem nota fiscal atual).</p>
                        <div className="flex gap-2">
                          <button onClick={() => confirmarAtualizacaoPreco(item)} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-md">Salvar</button>
                          <button onClick={cancelarEdicaoPreco} className="text-xs text-slate-500 px-2 py-1">Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          Venda: <span className="font-medium text-slate-700">{currency(item.precoVenda)}</span>
                          {' · '}Custo ref.: <span className="font-medium text-slate-700">{currency(item.custoReferencia || 0)}</span>
                        </span>
                        <button onClick={() => abrirEdicaoPreco(item)} className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1 rounded-md"><Pencil size={11} /> Atualizar preço</button>
                      </div>
                    )}
                  </div>
                  {(item.historicoPrecos || []).length > 0 && (
                    <div className="mb-2 text-xs">
                      <p className="text-slate-400 mb-1">Histórico de atualização de preço</p>
                      <div className="space-y-0.5">
                        {item.historicoPrecos.map((h, i) => (
                          <p key={i} className="text-slate-500">
                            {formatDate(h.data)} — venda {currency(h.precoAnterior)} → <span className="font-medium">{currency(h.precoNovo)}</span>
                            {h.custoNovo !== undefined && h.custoAnterior !== h.custoNovo && <> · custo ref. {currency(h.custoAnterior)} → <span className="font-medium">{currency(h.custoNovo)}</span></>}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  {item.serializado ? (
                    <table className="w-full text-xs">
                      <thead><tr className="text-slate-400 text-left"><th className="py-1 font-normal">Nº série</th><th className="py-1 font-normal">Status</th><th className="py-1 font-normal">Depósito</th><th className="py-1 font-normal">Custo compra</th><th className="py-1 font-normal">Entrada</th></tr></thead>
                      <tbody>
                        {(item.unidades || []).length === 0 && <tr><td colSpan={5} className="py-2 text-slate-400">Nenhuma unidade em estoque ainda.</td></tr>}
                        {(item.unidades || []).map(u => (
                          <tr key={u.id} className="border-t border-slate-100">
                            <td className="py-1.5 font-mono">{u.serial}</td>
                            <td className="py-1.5"><span className={`px-1.5 py-0.5 rounded text-[11px] ${u.status === 'Disponível' ? 'bg-emerald-100 text-emerald-700' : u.status === 'Vendido' ? 'bg-slate-200 text-slate-600' : u.status === 'Extraviado' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>{u.status}</span></td>
                            <td className="py-1.5">{depositos.find(d => d.id === u.depositoId)?.nome || '—'}</td>
                            <td className="py-1.5">{currency(u.custoCompra)}</td>
                            <td className="py-1.5">{formatDate(u.dataEntrada)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-xs">
                      <thead><tr className="text-slate-400 text-left"><th className="py-1 font-normal">Entrada</th><th className="py-1 font-normal">Depósito</th><th className="py-1 font-normal">NF</th><th className="py-1 font-normal">Custo un.</th><th className="py-1 font-normal">Disponível</th></tr></thead>
                      <tbody>
                        {(item.lotes || []).length === 0 && <tr><td colSpan={5} className="py-2 text-slate-400">Nenhum lote em estoque ainda.</td></tr>}
                        {(item.lotes || []).slice().sort((a, b) => new Date(a.dataEntrada) - new Date(b.dataEntrada)).map(l => (
                          <tr key={l.id} className="border-t border-slate-100">
                            <td className="py-1.5">{formatDate(l.dataEntrada)}</td>
                            <td className="py-1.5">{depositos.find(d => d.id === l.depositoId)?.nome || '—'}</td>
                            <td className="py-1.5">{l.notaFiscal}</td>
                            <td className="py-1.5">{currency(l.custoUnitario)}</td>
                            <td className="py-1.5">{l.quantidadeDisponivel}/{l.quantidade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- DEPÓSITOS ---------------- */

function DepositosModule({ depositos, setDepositos, askConfirm, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm());
  function emptyForm() { return { nome: '', endereco: '', observacoes: '' }; }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.nome) { notify('Preencha o nome do depósito antes de salvar'); return; }
    await setDepositos([...depositos, { id: uid(), ...form }]);
    notify('Depósito cadastrado'); setForm(emptyForm()); setShowForm(false);
  }
  async function handleDelete(id) {
    if (depositos.length <= 1) { notify('É preciso manter ao menos um depósito'); return; }
    if (!(await askConfirm('Remover este depósito? Itens ainda vinculados a ele continuarão registrados, mas ficarão sem depósito visível.'))) return;
    await setDepositos(depositos.filter(d => d.id !== id));
    notify('Depósito removido');
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
          <Plus size={16} /> Novo depósito
        </button>
      </div>
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">Novo depósito</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} className="text-slate-400" /></button>
          </div>
          <input placeholder="Nome do depósito" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
          <input placeholder="Endereço" value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
          <input placeholder="Observações" value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
          <button type="button" onClick={handleAdd} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800">Salvar depósito</button>
        </div>
      )}
      <div className="space-y-2">
        {depositos.map(d => (
          <div key={d.id} className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-start gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate flex items-center gap-1.5"><Warehouse size={14} className="text-slate-400" /> {d.nome}</p>
              {d.endereco && <p className="text-xs text-slate-500">{d.endereco}</p>}
            </div>
            <button onClick={() => handleDelete(d.id)}><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- TRANSFERÊNCIAS ENTRE DEPÓSITOS ---------------- */

function TransferenciasModule({ estoque, setEstoque, depositos, transferencias, setTransferencias, askSenha, notify }) {
  const [origemId, setOrigemId] = useState('');
  const [destinoId, setDestinoId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [unidadeId, setUnidadeId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('recente');

  const produto = estoque.find(p => p.id === produtoId);
  const produtosComEstoqueNaOrigem = origemId ? estoque.filter(p => availableQty(p, origemId) > 0) : [];
  const disponivelOrigem = produto && origemId ? availableQty(produto, origemId) : 0;

  function resetSelecao() { setProdutoId(''); setUnidadeId(''); setQuantidade(1); }

  async function confirmarTransferencia() {
    if (!origemId || !destinoId || origemId === destinoId) { notify('Selecione depósitos de origem e destino diferentes'); return; }
    if (!produto) { notify('Selecione o produto'); return; }
    const nomeOrigem = depositos.find(d => d.id === origemId)?.nome || '';
    const nomeDestino = depositos.find(d => d.id === destinoId)?.nome || '';
    setEnviando(true);
    const agora = new Date().toISOString();
    let novoEstoque = estoque.map(p => ({
      ...p,
      unidades: p.unidades ? p.unidades.map(u => ({ ...u })) : p.unidades,
      lotes: p.lotes ? p.lotes.map(l => ({ ...l })) : p.lotes,
    }));
    const idx = novoEstoque.findIndex(p => p.id === produtoId);
    let registro;

    if (produto.serializado) {
      if (!unidadeId) { notify('Selecione o número de série a transferir'); setEnviando(false); return; }
      const uIdx = novoEstoque[idx].unidades.findIndex(u => u.id === unidadeId);
      if (uIdx === -1 || novoEstoque[idx].unidades[uIdx].status !== 'Disponível') { notify('Unidade não está mais disponível'); setEnviando(false); return; }
      const serial = novoEstoque[idx].unidades[uIdx].serial;
      novoEstoque[idx].unidades[uIdx] = { ...novoEstoque[idx].unidades[uIdx], depositoId: destinoId };
      registro = { id: uid(), data: agora, produtoId, descricao: descricaoProduto(produto), serial, unidadeId, quantidade: 1, origemId, origemNome: nomeOrigem, destinoId, destinoNome: nomeDestino };
    } else {
      const qtd = parseInt(quantidade) || 0;
      if (qtd <= 0 || qtd > disponivelOrigem) { notify(`Informe uma quantidade entre 1 e ${disponivelOrigem}`); setEnviando(false); return; }
      let restante = qtd;
      const lotesOrigem = novoEstoque[idx].lotes.filter(l => l.depositoId === origemId).sort((a, b) => new Date(a.dataEntrada) - new Date(b.dataEntrada));
      const novosLotesDestino = [];
      for (const lote of lotesOrigem) {
        if (restante <= 0) break;
        if (lote.quantidadeDisponivel <= 0) continue;
        const consumo = Math.min(lote.quantidadeDisponivel, restante);
        lote.quantidadeDisponivel -= consumo;
        restante -= consumo;
        // Preserva custo e data original do lote para não distorcer o FIFO no destino
        novosLotesDestino.push({ id: uid(), quantidade: consumo, quantidadeDisponivel: consumo, custoUnitario: lote.custoUnitario, notaFiscal: lote.notaFiscal, fornecedor: lote.fornecedor, dataEntrada: lote.dataEntrada, depositoId: destinoId });
      }
      novoEstoque[idx].lotes = [
        ...novoEstoque[idx].lotes.map(l => lotesOrigem.find(lo => lo.id === l.id) || l),
        ...novosLotesDestino,
      ];
      registro = { id: uid(), data: agora, produtoId, descricao: descricaoProduto(produto), serial: null, loteDestinoIds: novosLotesDestino.map(l => l.id), quantidade: qtd, origemId, origemNome: nomeOrigem, destinoId, destinoNome: nomeDestino };
    }

    await setEstoque(novoEstoque);
    await setTransferencias([registro, ...transferencias]);
    setEnviando(false);
    notify('Transferência registrada');
    resetSelecao();
  }

  const transferenciasFiltradas = useMemo(() => {
    const lista = transferencias.filter(t => `${t.descricao} ${t.origemNome} ${t.destinoNome}`.toLowerCase().includes(busca.toLowerCase()));
    return lista.slice().sort((a, b) => {
      switch (ordenacao) {
        case 'recente': return new Date(b.data) - new Date(a.data);
        case 'antigo': return new Date(a.data) - new Date(b.data);
        case 'produto': return a.descricao.localeCompare(b.descricao, 'pt-BR');
        case 'qtdDesc': return b.quantidade - a.quantidade;
        default: return 0;
      }
    });
  }, [transferencias, busca, ordenacao]);

  async function apagarTransferencia(t) {
    if (t.anulado) return;
    const ok = await askSenha(`Apagar esta transferência de "${t.descricao}" (${t.origemNome} → ${t.destinoNome})? O item será devolvido ao depósito de origem e o lançamento ficará marcado como anulado no histórico.`);
    if (!ok) return;

    let novoEstoque = estoque.map(p => ({
      ...p,
      unidades: p.unidades ? p.unidades.map(u => ({ ...u })) : p.unidades,
      lotes: p.lotes ? p.lotes.map(l => ({ ...l })) : p.lotes,
    }));
    const idx = novoEstoque.findIndex(p => p.id === t.produtoId);
    if (idx === -1) {
      notify('Produto não encontrado — o lançamento foi marcado como anulado, mas nenhum estoque foi alterado');
      await setTransferencias(transferencias.map(x => x.id === t.id ? { ...x, anulado: true, anuladoEm: new Date().toISOString() } : x));
      return;
    }

    if (t.serial) {
      const uIdx = t.unidadeId
        ? novoEstoque[idx].unidades.findIndex(u => u.id === t.unidadeId)
        : novoEstoque[idx].unidades.findIndex(u => u.serial === t.serial);
      if (uIdx === -1) { notify('Não foi possível localizar essa unidade no estoque — nada foi alterado'); return; }
      if (novoEstoque[idx].unidades[uIdx].depositoId !== t.destinoId) { notify('Essa unidade já não está mais no depósito de destino (pode ter sido movida ou vendida depois) — verifique manualmente antes de anular'); return; }
      novoEstoque[idx].unidades[uIdx] = { ...novoEstoque[idx].unidades[uIdx], depositoId: t.origemId };
    } else if (t.loteDestinoIds && t.loteDestinoIds.length > 0) {
      for (const loteId of t.loteDestinoIds) {
        const lIdx = novoEstoque[idx].lotes.findIndex(l => l.id === loteId);
        if (lIdx === -1) continue;
        const lote = novoEstoque[idx].lotes[lIdx];
        if (lote.quantidadeDisponivel !== lote.quantidade) { notify('Parte desse item já foi vendida ou movida depois da transferência — não é possível anular automaticamente'); return; }
        novoEstoque[idx].lotes[lIdx] = { ...lote, depositoId: t.origemId };
      }
    } else {
      notify('Essa transferência é antiga demais para ser revertida automaticamente. Ajuste o estoque manualmente se necessário.');
      return;
    }

    await setEstoque(novoEstoque);
    await setTransferencias(transferencias.map(x => x.id === t.id ? { ...x, anulado: true, anuladoEm: new Date().toISOString() } : x));
    notify('Transferência anulada e item devolvido ao depósito de origem');
  }

  if (depositos.length < 2) {
    return <p className="text-sm text-slate-400 text-center py-8">Cadastre pelo menos 2 depósitos para poder transferir itens entre eles.</p>;
  }

  return (
    <div>
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
        <h3 className="font-medium text-sm">Nova transferência</h3>
        <div className="grid grid-cols-2 gap-2">
          <select value={origemId} onChange={e => { setOrigemId(e.target.value); resetSelecao(); }} className="border border-slate-200 rounded-md px-2 py-2 text-sm">
            <option value="">Depósito de origem...</option>
            {depositos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
          <select value={destinoId} onChange={e => setDestinoId(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm">
            <option value="">Depósito de destino...</option>
            {depositos.filter(d => d.id !== origemId).map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
          </select>
        </div>

        {origemId && (
          <select value={produtoId} onChange={e => { setProdutoId(e.target.value); setUnidadeId(''); }} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm">
            <option value="">Selecione o produto...</option>
            {produtosComEstoqueNaOrigem.map(p => <option key={p.id} value={p.id}>{p.categoria} · {descricaoProduto(p)} ({availableQty(p, origemId)} disp.)</option>)}
          </select>
        )}

        {produto && produto.serializado && (
          <select value={unidadeId} onChange={e => setUnidadeId(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm">
            <option value="">Número de série...</option>
            {produto.unidades.filter(u => u.status === 'Disponível' && u.depositoId === origemId).map(u => <option key={u.id} value={u.id}>{u.serial}</option>)}
          </select>
        )}
        {produto && !produto.serializado && (
          <input type="number" min={1} max={disponivelOrigem} value={quantidade} onChange={e => setQuantidade(e.target.value)} placeholder={`Quantidade (máx. ${disponivelOrigem})`} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
        )}

        <button onClick={confirmarTransferencia} disabled={enviando || !produto || !destinoId} className="w-full bg-amber-500 disabled:opacity-30 hover:bg-amber-600 text-slate-900 font-medium text-sm px-4 py-2 rounded-md">
          Confirmar transferência
        </button>
      </div>

      <h3 className="text-sm font-medium text-slate-500 mb-2">Histórico de transferências</h3>
      <FiltroBar
        busca={busca} setBusca={setBusca} buscaPlaceholder="Buscar por produto ou depósito..."
        ordenacaoValue={ordenacao} setOrdenacao={setOrdenacao}
        ordenacaoOptions={[{ value: 'recente', label: 'Mais recente primeiro' }, { value: 'antigo', label: 'Mais antigo primeiro' }, { value: 'produto', label: 'Produto (A-Z)' }, { value: 'qtdDesc', label: 'Maior quantidade primeiro' }]}
      />
      <div className="space-y-2">
        {transferencias.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhuma transferência registrada.</p>}
        {transferencias.length > 0 && transferenciasFiltradas.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhuma transferência encontrada com esse filtro.</p>}
        {transferenciasFiltradas.map(t => (
          <div key={t.id} className={`bg-white border rounded-lg p-3 text-sm flex justify-between items-start gap-2 ${t.anulado ? 'border-red-200 opacity-60' : 'border-slate-200'}`}>
            <div>
              <p className="font-medium flex items-center gap-1.5">
                <span className={t.anulado ? 'line-through' : ''}>{t.descricao}</span> {t.serial && <span className="text-xs font-mono text-slate-400">· SN {t.serial}</span>}
                {t.anulado && <span className="text-[11px] px-1.5 py-0.5 rounded bg-red-100 text-red-600">Anulado</span>}
              </p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                {t.origemNome} <ArrowLeftRight size={11} /> {t.destinoNome} · {t.quantidade}x · {formatDate(t.data)}
              </p>
              {t.anulado && <p className="text-[11px] text-red-500 mt-0.5">Anulado em {formatDate(t.anuladoEm)}</p>}
            </div>
            {!t.anulado && <button onClick={() => apagarTransferencia(t)} title="Apagar lançamento"><Trash2 size={14} className="text-slate-300 hover:text-red-500 shrink-0" /></button>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- FORNECEDORES ---------------- */

function FornecedoresModule({ fornecedores, setFornecedores, askConfirm, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(emptyForm());
  const [editandoFornecedorId, setEditandoFornecedorId] = useState(null);
  function emptyForm() { return { nome: '', cnpj: '', telefone: '', email: '', contato: '', endereco: '', observacoes: '' }; }
  function resetForm() { setForm(emptyForm()); setEditandoFornecedorId(null); setShowForm(false); }

  function abrirEdicaoFornecedor(f) {
    setForm({
      nome: f.nome || '', cnpj: f.cnpj || '', telefone: f.telefone || '', email: f.email || '',
      contato: f.contato || '', endereco: f.endereco || '', observacoes: f.observacoes || '',
    });
    setEditandoFornecedorId(f.id);
    setShowForm(true);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.nome) { notify('Preencha a razão social antes de salvar'); return; }
    if (editandoFornecedorId) {
      await setFornecedores(fornecedores.map(f => f.id === editandoFornecedorId ? { ...f, ...form } : f));
      notify('Fornecedor atualizado');
    } else {
      await setFornecedores([{ id: uid(), ...form }, ...fornecedores]);
      notify('Fornecedor cadastrado');
    }
    resetForm();
  }
  async function handleDelete(id) {
    if (!(await askConfirm('Remover este fornecedor?'))) return;
    await setFornecedores(fornecedores.filter(f => f.id !== id));
    notify('Fornecedor removido');
  }
  const filtrado = fornecedores.filter(f => `${f.nome} ${f.cnpj}`.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar fornecedor..." className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <button onClick={() => { resetForm(); setShowForm(s => !s); }} className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
          <Plus size={16} /> Novo fornecedor
        </button>
      </div>
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">{editandoFornecedorId ? 'Editar fornecedor' : 'Novo fornecedor'}</h3>
            <button type="button" onClick={resetForm}><X size={16} className="text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input placeholder="Razão social" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm sm:col-span-2" />
            <input placeholder="CNPJ" value={form.cnpj} onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="Telefone" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="E-mail" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="Contato (vendedor)" value={form.contato} onChange={e => setForm(f => ({ ...f, contato: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="Endereço" value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm sm:col-span-2" />
            <input placeholder="Observações" value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm sm:col-span-2" />
          </div>
          <button type="button" onClick={handleAdd} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800">{editandoFornecedorId ? 'Salvar alterações' : 'Salvar fornecedor'}</button>
        </div>
      )}
      <div className="space-y-2">
        {filtrado.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum fornecedor cadastrado.</p>}
        {filtrado.map(f => (
          <div key={f.id} className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-start gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{f.nome}</p>
              <p className="text-xs text-slate-500">{[f.cnpj, f.telefone, f.contato].filter(Boolean).join(' · ')}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => abrirEdicaoFornecedor(f)} title="Editar fornecedor"><Pencil size={14} className="text-slate-300 hover:text-slate-600" /></button>
              <button onClick={() => handleDelete(f.id)} title="Remover fornecedor"><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- PEDIDOS DE COMPRA (como um "orçamento" de compra, ainda sem estoque) ---------------- */

function PedidoCompraModule({ estoque, setEstoque, fornecedores, pedidos, setPedidos, recebimentos, askConfirm, askSenha, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [numeroPedidoFornecedor, setNumeroPedidoFornecedor] = useState('');
  const [numeroNotaFiscal, setNumeroNotaFiscal] = useState('');
  const [fornecedorId, setFornecedorId] = useState('');
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [itensStaging, setItensStaging] = useState([]);
  const [expanded, setExpanded] = useState({});

  const [modoNovoProduto, setModoNovoProduto] = useState(false);
  const [produtoSel, setProdutoSel] = useState('');
  const [novoProd, setNovoProd] = useState({ categoria: 'Inversor', marca: '', modelo: '', potencia: '', serializado: true, precoVenda: '', quantidadeMinima: '' });
  const [quantidade, setQuantidade] = useState('');
  const [custoUnitario, setCustoUnitario] = useState('');

  function resetLinha() {
    setModoNovoProduto(false); setProdutoSel('');
    setNovoProd({ categoria: 'Inversor', marca: '', modelo: '', potencia: '', serializado: true, precoVenda: '', quantidadeMinima: '' });
    setQuantidade(''); setCustoUnitario('');
  }

  const produtoExistente = estoque.find(i => i.id === produtoSel);

  function addLinha() {
    const custo = parseValorBR(custoUnitario) || 0;
    const qtd = parseInt(quantidade) || 0;
    if (!custo || !qtd) { notify('Informe quantidade e custo unitário'); return; }
    if (modoNovoProduto) {
      if (!novoProd.marca || !novoProd.modelo) { notify('Preencha marca e modelo do novo produto'); return; }
    } else if (!produtoExistente) { notify('Selecione um produto ou cadastre um novo'); return; }

    setItensStaging(s => [...s, {
      tempId: uid(), produtoId: modoNovoProduto ? null : produtoExistente.id,
      novoProduto: modoNovoProduto ? { ...novoProd } : null,
      categoria: modoNovoProduto ? novoProd.categoria : produtoExistente.categoria,
      serializado: modoNovoProduto ? novoProd.serializado : produtoExistente.serializado,
      descricao: modoNovoProduto ? descricaoProduto(novoProd) : descricaoProduto(produtoExistente),
      quantidade: qtd, custoUnitario: custo,
    }]);
    resetLinha();
  }

  function removeLinha(tempId) { setItensStaging(s => s.filter(i => i.tempId !== tempId)); }
  const valorTotal = itensStaging.reduce((acc, i) => acc + i.custoUnitario * i.quantidade, 0);

  async function confirmarPedido() {
    if (!fornecedorId || !numeroPedidoFornecedor || itensStaging.length === 0) { notify('Informe fornecedor, número do pedido e ao menos um item'); return; }
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    let novoEstoque = estoque.map(i => ({ ...i }));
    const itensFinal = [];

    for (const linha of itensStaging) {
      let produtoId = linha.produtoId;
      if (!produtoId) {
        const criado = {
          id: uid(), categoria: linha.novoProduto.categoria, marca: linha.novoProduto.marca.trim(), modelo: linha.novoProduto.modelo.trim(),
          potencia: (linha.novoProduto.potencia || '').trim(), serializado: linha.novoProduto.serializado,
          precoVenda: parseValorBR(linha.novoProduto.precoVenda) || 0, quantidadeMinima: parseInt(linha.novoProduto.quantidadeMinima) || 0,
          observacoes: '', unidades: linha.novoProduto.serializado ? [] : undefined, lotes: linha.novoProduto.serializado ? undefined : [],
        };
        novoEstoque = [criado, ...novoEstoque];
        produtoId = criado.id;
      }
      itensFinal.push({ id: uid(), produtoId, descricao: linha.descricao, categoria: linha.categoria, serializado: linha.serializado, quantidade: linha.quantidade, custoUnitario: linha.custoUnitario });
    }

    await setEstoque(novoEstoque);
    const pedido = {
      id: uid(), numeroPedidoFornecedor, numeroNotaFiscal, fornecedorId, fornecedorNome: fornecedor?.nome || '',
      data: new Date(data + 'T12:00:00').toISOString(), itens: itensFinal, valorTotal, cancelado: false,
    };
    await setPedidos([pedido, ...pedidos]);
    notify('Pedido de compra registrado. Dê entrada dos itens em "Recebimento" quando a mercadoria chegar.');
    setNumeroPedidoFornecedor(''); setNumeroNotaFiscal(''); setFornecedorId(''); setData(new Date().toISOString().slice(0, 10));
    setItensStaging([]); setShowForm(false);
  }

  async function cancelarPedido(id) {
    if (!(await askConfirm('Cancelar este pedido de compra?'))) return;
    await setPedidos(pedidos.map(p => p.id === id ? { ...p, cancelado: true } : p));
    notify('Pedido cancelado');
  }

  async function apagarPedido(p) {
    if (p.anulado) return;
    const temRecebimento = p.itens.some(it => qtdRecebida(recebimentos, p.id, it.id) > 0);
    const aviso = temRecebimento
      ? ` Atenção: parte deste pedido já foi recebida e o estoque correspondente NÃO será removido automaticamente — ajuste o estoque manualmente se necessário.`
      : '';
    const ok = await askSenha(`Apagar o pedido ${p.numeroPedidoFornecedor} de ${p.fornecedorNome} (${currency(p.valorTotal)})? Ele ficará marcado como anulado no histórico.${aviso}`);
    if (!ok) return;
    await setPedidos(pedidos.map(x => x.id === p.id ? { ...x, anulado: true, anuladoEm: new Date().toISOString() } : x));
    notify('Pedido de compra anulado');
  }

  const [editandoItem, setEditandoItem] = useState(null); // { pedidoId, itemId }
  const [qtdEditada, setQtdEditada] = useState('');
  const [custoEditado, setCustoEditado] = useState('');

  function abrirEdicaoItem(pedido, item) {
    setEditandoItem({ pedidoId: pedido.id, itemId: item.id });
    setQtdEditada(String(item.quantidade));
    setCustoEditado(String(item.custoUnitario));
  }
  function cancelarEdicaoItem() { setEditandoItem(null); setQtdEditada(''); setCustoEditado(''); }

  async function salvarEdicaoItem(pedido, item) {
    const novaQtd = parseInt(qtdEditada);
    const novoCusto = parseValorBR(custoEditado);
    if (isNaN(novaQtd) || novaQtd <= 0) { notify('Informe uma quantidade válida'); return; }
    if (isNaN(novoCusto) || novoCusto < 0) { notify('Informe um custo unitário válido'); return; }
    const recebido = qtdRecebida(recebimentos, pedido.id, item.id);
    if (novaQtd < recebido) { notify(`Não é possível informar quantidade menor que o já recebido (${recebido})`); return; }
    if (novaQtd === item.quantidade && novoCusto === item.custoUnitario) { cancelarEdicaoItem(); return; }

    const ok = await askSenha(
      `Alterar "${item.descricao}" no pedido ${pedido.numeroPedidoFornecedor}? Quantidade: ${item.quantidade} → ${novaQtd}. Custo unitário: ${currency(item.custoUnitario)} → ${currency(novoCusto)}.`,
      { label: 'Salvar alteração', destrutivo: false }
    );
    if (!ok) return;

    await setPedidos(pedidos.map(p => {
      if (p.id !== pedido.id) return p;
      const itens = p.itens.map(i => i.id === item.id ? { ...i, quantidade: novaQtd, custoUnitario: novoCusto } : i);
      const valorTotal = itens.reduce((acc, i) => acc + i.quantidade * i.custoUnitario, 0);
      return { ...p, itens, valorTotal };
    }));
    notify('Item do pedido atualizado');
    cancelarEdicaoItem();
  }

  async function removerItemPedido(pedido, item) {
    const recebido = qtdRecebida(recebimentos, pedido.id, item.id);
    if (recebido > 0) { notify('Não é possível remover um item que já teve recebimento — anule o recebimento primeiro, se necessário'); return; }
    if (pedido.itens.length <= 1) { notify('O pedido precisa ter ao menos um item. Para removê-lo por completo, anule o pedido.'); return; }
    const ok = await askSenha(`Remover "${item.descricao}" (${item.quantidade}x ${currency(item.custoUnitario)}) do pedido ${pedido.numeroPedidoFornecedor}?`);
    if (!ok) return;
    await setPedidos(pedidos.map(p => {
      if (p.id !== pedido.id) return p;
      const itens = p.itens.filter(i => i.id !== item.id);
      const valorTotal = itens.reduce((acc, i) => acc + i.quantidade * i.custoUnitario, 0);
      return { ...p, itens, valorTotal };
    }));
    notify('Item removido do pedido');
  }

  const [adicionandoItemEm, setAdicionandoItemEm] = useState(null); // pedidoId
  const [novoItemProdutoId, setNovoItemProdutoId] = useState('');
  const [novoItemQtd, setNovoItemQtd] = useState('');
  const [novoItemCusto, setNovoItemCusto] = useState('');

  function abrirAdicionarItem(pedidoId) {
    setAdicionandoItemEm(pedidoId); setNovoItemProdutoId(''); setNovoItemQtd(''); setNovoItemCusto('');
  }
  function cancelarAdicionarItem() { setAdicionandoItemEm(null); setNovoItemProdutoId(''); setNovoItemQtd(''); setNovoItemCusto(''); }

  async function confirmarAdicionarItem(pedido) {
    const produto = estoque.find(p => p.id === novoItemProdutoId);
    const qtd = parseInt(novoItemQtd);
    const custo = parseValorBR(novoItemCusto);
    if (!produto) { notify('Selecione um produto já cadastrado'); return; }
    if (isNaN(qtd) || qtd <= 0) { notify('Informe uma quantidade válida'); return; }
    if (isNaN(custo) || custo < 0) { notify('Informe um custo unitário válido'); return; }

    const ok = await askSenha(`Adicionar "${descricaoProduto(produto)}" (${qtd}x ${currency(custo)}) ao pedido ${pedido.numeroPedidoFornecedor}?`, { label: 'Adicionar item', destrutivo: false });
    if (!ok) return;

    const novoItem = { id: uid(), produtoId: produto.id, descricao: descricaoProduto(produto), categoria: produto.categoria, serializado: produto.serializado, quantidade: qtd, custoUnitario: custo };
    await setPedidos(pedidos.map(p => {
      if (p.id !== pedido.id) return p;
      const itens = [...p.itens, novoItem];
      const valorTotal = itens.reduce((acc, i) => acc + i.quantidade * i.custoUnitario, 0);
      return { ...p, itens, valorTotal };
    }));
    notify('Item adicionado ao pedido');
    cancelarAdicionarItem();
  }

  function statusPedido(p) {
    if (p.anulado) return { label: 'Anulado', style: 'bg-red-100 text-red-600' };
    if (p.cancelado) return { label: 'Cancelado', style: 'bg-red-100 text-red-600' };
    const pendente = p.itens.some(it => it.quantidade - qtdRecebida(recebimentos, p.id, it.id) > 0);
    return pendente ? { label: 'Aguardando recebimento', style: 'bg-amber-100 text-amber-700' } : { label: 'Recebido', style: 'bg-emerald-100 text-emerald-700' };
  }

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('recente');

  const pedidosFiltrados = useMemo(() => {
    let lista = pedidos.filter(p => `${p.fornecedorNome} ${p.numeroPedidoFornecedor} ${p.numeroNotaFiscal || ''}`.toLowerCase().includes(busca.toLowerCase()));
    if (filtroStatus !== 'Todos') lista = lista.filter(p => statusPedido(p).label === filtroStatus);
    return lista.slice().sort((a, b) => {
      switch (ordenacao) {
        case 'recente': return new Date(b.data) - new Date(a.data);
        case 'antigo': return new Date(a.data) - new Date(b.data);
        case 'valorDesc': return b.valorTotal - a.valorTotal;
        case 'valorAsc': return a.valorTotal - b.valorTotal;
        case 'fornecedor': return a.fornecedorNome.localeCompare(b.fornecedorNome, 'pt-BR');
        default: return 0;
      }
    });
  }, [pedidos, busca, filtroStatus, ordenacao, recebimentos]);

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
          <Plus size={16} /> Novo pedido de compra
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">Novo pedido de compra</h3>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-slate-400" /></button>
          </div>
          {fornecedores.length === 0 && <p className="text-xs text-amber-600">Cadastre um fornecedor primeiro na aba "Fornecedores".</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select value={fornecedorId} onChange={e => setFornecedorId(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm sm:col-span-2">
              <option value="">Selecione o fornecedor...</option>
              {fornecedores.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
            <input placeholder="Número do pedido no fornecedor" value={numeroPedidoFornecedor} onChange={e => setNumeroPedidoFornecedor(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="Número da nota fiscal" value={numeroNotaFiscal} onChange={e => setNumeroNotaFiscal(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input type="date" value={data} onChange={e => setData(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm sm:col-span-2" />
          </div>

          <div className="border border-dashed border-slate-200 rounded-md p-3 space-y-2">
            <p className="text-xs text-slate-500 font-medium">Adicionar item do pedido</p>
            <div className="flex gap-3 text-xs">
              <label className="flex items-center gap-1"><input type="radio" checked={!modoNovoProduto} onChange={() => setModoNovoProduto(false)} /> Produto existente</label>
              <label className="flex items-center gap-1"><input type="radio" checked={modoNovoProduto} onChange={() => setModoNovoProduto(true)} /> Cadastrar novo produto</label>
            </div>

            {!modoNovoProduto ? (
              <select value={produtoSel} onChange={e => setProdutoSel(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm">
                <option value="">Selecione o produto...</option>
                {estoque.map(i => <option key={i.id} value={i.id}>{i.categoria} · {descricaoProduto(i)}</option>)}
              </select>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <select value={novoProd.categoria} onChange={e => setNovoProd(p => ({ ...p, categoria: e.target.value, serializado: SERIALIZAVEL_PADRAO[e.target.value] }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm">
                  {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>
                <input placeholder="Marca" value={novoProd.marca} onChange={e => setNovoProd(p => ({ ...p, marca: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
                <input placeholder="Modelo" value={novoProd.modelo} onChange={e => setNovoProd(p => ({ ...p, modelo: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
                <input placeholder="Potência" value={novoProd.potencia} onChange={e => setNovoProd(p => ({ ...p, potencia: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
                <input type="text" inputMode="decimal" placeholder="Preço de venda (R$) ex: 518,42" value={novoProd.precoVenda} onChange={e => setNovoProd(p => ({ ...p, precoVenda: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
                <input type="number" placeholder="Estoque mínimo" value={novoProd.quantidadeMinima} onChange={e => setNovoProd(p => ({ ...p, quantidadeMinima: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
                <label className="flex items-center gap-1.5 text-xs text-slate-600 col-span-2">
                  <input type="checkbox" checked={novoProd.serializado} onChange={e => setNovoProd(p => ({ ...p, serializado: e.target.checked }))} /> Controlar por número de série
                </label>
              </div>
            )}

            <p className="text-[11px] text-slate-400">O número de série de cada inversor será digitado depois, item por item, na etapa de Recebimento.</p>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
              <input type="text" inputMode="decimal" placeholder="Custo unitário (R$) ex: 468,00" value={custoUnitario} onChange={e => setCustoUnitario(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            </div>
            <button type="button" onClick={addLinha} className="bg-slate-900 text-white text-sm px-3 py-2 rounded-md">Adicionar item ao pedido</button>
          </div>

          {itensStaging.length > 0 && (
            <div className="border border-slate-100 rounded-md divide-y">
              {itensStaging.map(i => (
                <div key={i.tempId} className="flex justify-between items-center px-3 py-2 text-sm">
                  <div>
                    <p>{i.descricao} {i.novoProduto && <span className="text-xs text-amber-600">(novo produto)</span>}</p>
                    <p className="text-xs text-slate-400">{i.quantidade}x {currency(i.custoUnitario)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{currency(i.custoUnitario * i.quantidade)}</span>
                    <button onClick={() => removeLinha(i.tempId)}><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="text-sm text-slate-500">Valor total do pedido</span>
            <span className="text-lg font-semibold">{currency(valorTotal)}</span>
          </div>

          <button onClick={confirmarPedido} disabled={!fornecedorId || !numeroPedidoFornecedor || itensStaging.length === 0} className="w-full bg-amber-500 disabled:opacity-30 hover:bg-amber-600 text-slate-900 font-medium text-sm px-4 py-2 rounded-md">
            Confirmar pedido de compra
          </button>
        </div>
      )}

      <h3 className="text-sm font-medium text-slate-500 mb-2">Pedidos de compra</h3>
      <FiltroBar
        busca={busca} setBusca={setBusca} buscaPlaceholder="Buscar por fornecedor, pedido ou NF..."
        filtroValue={filtroStatus} setFiltro={setFiltroStatus}
        filtroOptions={[{ value: 'Todos', label: 'Todos os status' }, { value: 'Aguardando recebimento', label: 'Aguardando recebimento' }, { value: 'Recebido', label: 'Recebido' }, { value: 'Cancelado', label: 'Cancelado' }, { value: 'Anulado', label: 'Anulado' }]}
        ordenacaoValue={ordenacao} setOrdenacao={setOrdenacao}
        ordenacaoOptions={[{ value: 'recente', label: 'Mais recente primeiro' }, { value: 'antigo', label: 'Mais antigo primeiro' }, { value: 'valorDesc', label: 'Maior valor primeiro' }, { value: 'valorAsc', label: 'Menor valor primeiro' }, { value: 'fornecedor', label: 'Fornecedor (A-Z)' }]}
      />
      <div className="space-y-2">
        {pedidos.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum pedido registrado.</p>}
        {pedidos.length > 0 && pedidosFiltrados.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum pedido encontrado com esse filtro.</p>}
        {pedidosFiltrados.map(p => {
          const status = statusPedido(p);
          return (
            <div key={p.id} className={`bg-white border rounded-lg overflow-hidden ${p.anulado ? 'border-red-200 opacity-60' : 'border-slate-200'}`}>
              <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpanded(x => ({ ...x, [p.id]: !x[p.id] }))}>
                <div className="flex items-center gap-2 min-w-0">
                  <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expanded[p.id] ? 'rotate-90' : ''}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate flex items-center gap-1.5"><span className={p.anulado ? 'line-through' : ''}>{p.fornecedorNome}</span> <span className={`text-[11px] px-1.5 py-0.5 rounded ${status.style}`}>{status.label}</span></p>
                    <p className="text-xs text-slate-400">Pedido {p.numeroPedidoFornecedor} {p.numeroNotaFiscal && `· NF ${p.numeroNotaFiscal}`} · {formatDate(p.data)} {p.anulado && `· anulado em ${formatDate(p.anuladoEm)}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-medium text-sm">{currency(p.valorTotal)}</span>
                  {!p.anulado && !p.cancelado && status.label !== 'Recebido' && (
                    <button onClick={(e) => { e.stopPropagation(); cancelarPedido(p.id); }} title="Cancelar (antes de receber)"><Ban size={14} className="text-slate-300 hover:text-red-500" /></button>
                  )}
                  {!p.anulado && (
                    <button onClick={(e) => { e.stopPropagation(); apagarPedido(p); }} title="Apagar lançamento"><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
                  )}
                </div>
              </div>
              {expanded[p.id] && (
                <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 space-y-1.5">
                  {p.itens.map((i, idx) => {
                    const recebido = qtdRecebida(recebimentos, p.id, i.id);
                    const editando = editandoItem && editandoItem.pedidoId === p.id && editandoItem.itemId === i.id;
                    if (editando) {
                      return (
                        <div key={idx} className="bg-white border border-slate-200 rounded-md p-2 space-y-1.5">
                          <p className="text-xs text-slate-500">{i.descricao} <span className="text-slate-400">(recebido {recebido})</span></p>
                          <div className="flex flex-col sm:flex-row gap-1.5">
                            <input type="number" min={recebido || 1} value={qtdEditada} onChange={e => setQtdEditada(e.target.value)} placeholder="Quantidade" className="border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:w-28" />
                            <input type="text" inputMode="decimal" value={custoEditado} onChange={e => setCustoEditado(e.target.value)} placeholder="Custo unitário" className="border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:w-32" />
                            <button onClick={() => salvarEdicaoItem(p, i)} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-md">Salvar</button>
                            <button onClick={cancelarEdicaoItem} className="text-xs text-slate-500 px-2.5 py-1.5">Cancelar</button>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="flex justify-between items-center gap-2 text-xs text-slate-600">
                        <span className="min-w-0">{i.descricao} — {i.quantidade}x {currency(i.custoUnitario)} · recebido {recebido}/{i.quantidade}</span>
                        {!p.anulado && (
                          <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => abrirEdicaoItem(p, i)} title="Editar item" className="flex items-center gap-1 text-slate-500 hover:text-slate-900 border border-slate-200 hover:border-slate-400 rounded px-1.5 py-1"><Pencil size={12} /> Editar</button>
                            <button onClick={() => removerItemPedido(p, i)} title="Remover item" className="flex items-center text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-300 rounded px-1.5 py-1"><Trash2 size={12} /></button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {!p.anulado && (
                    adicionandoItemEm === p.id ? (
                      <div className="bg-white border border-slate-200 rounded-md p-2 space-y-1.5 mt-1">
                        <select value={novoItemProdutoId} onChange={e => setNovoItemProdutoId(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-1.5 text-xs">
                          <option value="">Selecione o produto (já cadastrado)...</option>
                          {estoque.map(prod => <option key={prod.id} value={prod.id}>{prod.categoria} · {descricaoProduto(prod)}</option>)}
                        </select>
                        <div className="flex flex-col sm:flex-row gap-1.5">
                          <input type="number" min={1} value={novoItemQtd} onChange={e => setNovoItemQtd(e.target.value)} placeholder="Quantidade" className="border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:w-28" />
                          <input type="text" inputMode="decimal" value={novoItemCusto} onChange={e => setNovoItemCusto(e.target.value)} placeholder="Custo unitário" className="border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:w-32" />
                          <button onClick={() => confirmarAdicionarItem(p)} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-md">Adicionar</button>
                          <button onClick={cancelarAdicionarItem} className="text-xs text-slate-500 px-2.5 py-1.5">Cancelar</button>
                        </div>
                        <p className="text-[10px] text-slate-400">Pra cadastrar um produto novo (marca/modelo/potência), use a aba Cadastros → Estoque primeiro.</p>
                      </div>
                    ) : (
                      <button onClick={() => abrirAdicionarItem(p.id)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 border border-dashed border-slate-300 hover:border-slate-400 rounded px-2 py-1.5 mt-1">
                        <Plus size={12} /> Adicionar item ao pedido
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- RECEBIMENTO (entrada item a item, com foto e nº de série) ---------------- */

function RecebimentoModule({ pedidos, setPedidos, recebimentos, setRecebimentos, estoque, setEstoque, depositos, askSenha, notify }) {
  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('recente');

  function ordenar(lista) {
    return lista.slice().sort((a, b) => {
      switch (ordenacao) {
        case 'recente': return new Date(b.data) - new Date(a.data);
        case 'antigo': return new Date(a.data) - new Date(b.data);
        case 'fornecedor': return a.fornecedorNome.localeCompare(b.fornecedorNome, 'pt-BR');
        default: return 0;
      }
    });
  }

  function combina(p) { return `${p.fornecedorNome} ${p.numeroPedidoFornecedor} ${p.numeroNotaFiscal || ''}`.toLowerCase().includes(busca.toLowerCase()); }

  const pedidosComPendencia = useMemo(() => {
    return ordenar(pedidos
      .filter(p => !p.cancelado && !p.anulado && combina(p))
      .map(p => ({ ...p, itensPendentes: p.itens.map(it => ({ ...it, pendente: it.quantidade - qtdRecebida(recebimentos, p.id, it.id) })).filter(it => it.pendente > 0) }))
      .filter(p => p.itensPendentes.length > 0));
  }, [pedidos, recebimentos, busca, ordenacao]);

  const pedidosConcluidos = useMemo(() => {
    return ordenar(pedidos.filter(p => !p.cancelado && !p.anulado && combina(p) && p.itens.every(it => it.quantidade - qtdRecebida(recebimentos, p.id, it.id) <= 0)));
  }, [pedidos, recebimentos, busca, ordenacao]);

  const [expandedPedido, setExpandedPedido] = useState({});
  const [formItem, setFormItem] = useState(null);
  const [expandedHistorico, setExpandedHistorico] = useState({});

  async function apagarRecebimento(registro) {
    if (registro.anulado) return;
    const ok = await askSenha(`Apagar este recebimento (${registro.descricao}${registro.serial ? ` · SN ${registro.serial}` : ` · ${registro.quantidade} un.`})? O item correspondente será removido do estoque e o pedido voltará a ficar pendente.`);
    if (!ok) return;

    let novoEstoque = estoque.map(p => ({
      ...p,
      unidades: p.unidades ? p.unidades.map(u => ({ ...u })) : p.unidades,
      lotes: p.lotes ? p.lotes.map(l => ({ ...l })) : p.lotes,
    }));
    const idx = novoEstoque.findIndex(p => p.id === registro.produtoId);
    if (idx === -1) { notify('Produto não encontrado no estoque — nada foi alterado'); return; }

    if (registro.unidadeId) {
      const uIdx = novoEstoque[idx].unidades.findIndex(u => u.id === registro.unidadeId);
      if (uIdx === -1) { notify('Essa unidade já não existe mais no estoque'); return; }
      if (novoEstoque[idx].unidades[uIdx].status !== 'Disponível') { notify('Essa unidade já foi vendida ou movimentada — não é possível apagar este recebimento'); return; }
      novoEstoque[idx].unidades = novoEstoque[idx].unidades.filter(u => u.id !== registro.unidadeId);
    } else if (registro.loteId) {
      const lIdx = novoEstoque[idx].lotes.findIndex(l => l.id === registro.loteId);
      if (lIdx === -1) { notify('Esse lote já não existe mais no estoque'); return; }
      const lote = novoEstoque[idx].lotes[lIdx];
      if (lote.quantidadeDisponivel !== lote.quantidade) { notify('Parte deste lote já foi vendida ou transferida — não é possível apagar este recebimento'); return; }
      novoEstoque[idx].lotes = novoEstoque[idx].lotes.filter(l => l.id !== registro.loteId);
    } else {
      notify('Esse recebimento é antigo demais para ser revertido automaticamente.');
      return;
    }

    await setEstoque(novoEstoque);
    await setRecebimentos(recebimentos.map(r => r.id === registro.id ? { ...r, anulado: true, anuladoEm: new Date().toISOString() } : r));
    notify('Recebimento anulado e item removido do estoque');
  }

  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">A entrada só pode ser feita a partir de um pedido de compra já cadastrado. Para cada inversor, tire uma foto da etiqueta e digite o número de série na hora — item por item — até completar a quantidade do pedido.</p>

      <FiltroBar
        busca={busca} setBusca={setBusca} buscaPlaceholder="Buscar por fornecedor, pedido ou NF..."
        ordenacaoValue={ordenacao} setOrdenacao={setOrdenacao}
        ordenacaoOptions={[{ value: 'recente', label: 'Mais recente primeiro' }, { value: 'antigo', label: 'Mais antigo primeiro' }, { value: 'fornecedor', label: 'Fornecedor (A-Z)' }]}
      />

      <h3 className="text-sm font-medium text-slate-500 mb-2">Aguardando recebimento</h3>
      <div className="space-y-2 mb-6">
        {pedidosComPendencia.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum recebimento pendente.</p>}
        {pedidosComPendencia.map(p => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpandedPedido(x => ({ ...x, [p.id]: !x[p.id] }))}>
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expandedPedido[p.id] ? 'rotate-90' : ''}`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{p.fornecedorNome}</p>
                  <p className="text-xs text-slate-400">Pedido {p.numeroPedidoFornecedor} {p.numeroNotaFiscal && `· NF ${p.numeroNotaFiscal}`}</p>
                </div>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 shrink-0">Pendente</span>
            </div>
            {expandedPedido[p.id] && (
              <div className="border-t border-slate-100 divide-y divide-slate-100">
                {p.itensPendentes.map(it => {
                  const historicoItem = recebimentos.filter(r => r.pedidoId === p.id && r.itemLineId === it.id);
                  return (
                  <div key={it.id} className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">{it.descricao}</p>
                        <p className="text-xs text-slate-400">{it.pendente} de {it.quantidade} pendente(s) · custo {currency(it.custoUnitario)}</p>
                      </div>
                      <button onClick={() => setFormItem({ pedidoId: p.id, item: it })} className="flex items-center gap-1 text-xs bg-slate-900 text-white px-2.5 py-1.5 rounded-md">
                        <Camera size={12} /> Registrar entrada
                      </button>
                    </div>
                    {historicoItem.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {historicoItem.map(r => (
                          <div key={r.id} className={`flex items-center gap-2 text-xs pl-2 border-l-2 ${r.anulado ? 'border-red-200' : 'border-emerald-200'}`}>
                            <span className={r.anulado ? 'line-through text-slate-400' : 'text-slate-500'}>
                              {r.serial ? `SN ${r.serial}` : `${r.quantidade} un.`} · {formatDate(r.data)}
                            </span>
                            {r.anulado && <span className="text-[10px] px-1 py-0.5 rounded bg-red-100 text-red-600">Anulado</span>}
                            {!r.anulado && <button onClick={() => apagarRecebimento(r)} title="Apagar lançamento"><Trash2 size={12} className="text-slate-300 hover:text-red-500" /></button>}
                          </div>
                        ))}
                      </div>
                    )}
                    {formItem && formItem.pedidoId === p.id && formItem.item.id === it.id && (
                      <RecebimentoForm
                        pedido={p}
                        item={it}
                        pendente={it.pendente}
                        estoque={estoque}
                        setEstoque={setEstoque}
                        recebimentos={recebimentos}
                        setRecebimentos={setRecebimentos}
                        depositos={depositos}
                        notify={notify}
                        onDone={() => setFormItem(null)}
                        onCancel={() => setFormItem(null)}
                      />
                    )}
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="text-sm font-medium text-slate-500 mb-2">Recebimentos concluídos</h3>
      <div className="space-y-2">
        {pedidosConcluidos.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum pedido totalmente recebido ainda.</p>}
        {pedidosConcluidos.map(p => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpandedHistorico(x => ({ ...x, [p.id]: !x[p.id] }))}>
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expandedHistorico[p.id] ? 'rotate-90' : ''}`} />
                <p className="font-medium text-sm truncate">{p.fornecedorNome} · Pedido {p.numeroPedidoFornecedor}</p>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 shrink-0">Recebido</span>
            </div>
            {expandedHistorico[p.id] && (
              <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 space-y-3">
                {p.itens.map(it => {
                  const regs = recebimentos.filter(r => r.pedidoId === p.id && r.itemLineId === it.id);
                  return (
                    <div key={it.id} className="text-xs">
                      <p className="text-slate-600 font-medium">{it.descricao}</p>
                      {regs.map(r => (
                        <div key={r.id} className={`flex items-center gap-2 mt-1 pl-2 border-l-2 ${r.anulado ? 'border-red-200' : 'border-emerald-200'}`}>
                          <span className={r.anulado ? 'line-through text-slate-400' : ''}>
                            {r.serial && <span className="font-mono text-slate-500">SN {r.serial}</span>}
                            {!r.serial && <span className="text-slate-500">{r.quantidade} un.</span>}
                          </span>
                          {r.depositoNome && <span className="text-slate-400 flex items-center gap-0.5"><Warehouse size={10} /> {r.depositoNome}</span>}
                          <span className="text-slate-400">{formatDate(r.data)}</span>
                          {r.foto && <a href={r.foto} target="_blank" rel="noreferrer"><img src={r.foto} alt="Foto da entrada" className="w-10 h-10 object-cover rounded border border-slate-200" /></a>}
                          {r.anulado ? (
                            <span className="text-[10px] px-1 py-0.5 rounded bg-red-100 text-red-600">Anulado</span>
                          ) : (
                            <button onClick={() => apagarRecebimento(r)} title="Apagar lançamento"><Trash2 size={12} className="text-slate-300 hover:text-red-500" /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function RecebimentoForm({ pedido, item, pendente, estoque, setEstoque, recebimentos, setRecebimentos, depositos, notify, onDone, onCancel }) {
  const [serial, setSerial] = useState('');
  const [foto, setFoto] = useState(null);
  const [qtdInput, setQtdInput] = useState(pendente);
  const [depositoId, setDepositoId] = useState(depositos.length === 1 ? depositos[0].id : '');
  const [enviando, setEnviando] = useState(false);

  async function handleFoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const comprimida = await fileToCompressedDataUrl(file);
    setFoto(comprimida);
  }

  async function confirmarUnidade() {
    if (!depositoId) { notify('Selecione o depósito de destino'); return; }
    if (!serial.trim()) { notify('Digite o número de série do inversor'); return; }
    if (!foto) { notify('Anexe a foto da etiqueta de série'); return; }
    setEnviando(true);
    const agora = new Date().toISOString();
    const depositoNome = depositos.find(d => d.id === depositoId)?.nome || '';
    const novaUnidade = { id: uid(), serial: serial.trim(), status: 'Disponível', custoCompra: item.custoUnitario, notaFiscal: pedido.numeroNotaFiscal, fornecedor: pedido.fornecedorNome, dataEntrada: agora, depositoId };
    const novoEstoque = estoque.map(p => p.id === item.produtoId ? { ...p, unidades: [...(p.unidades || []), novaUnidade] } : p);
    await setEstoque(novoEstoque);
    const registro = { id: uid(), pedidoId: pedido.id, itemLineId: item.id, produtoId: item.produtoId, unidadeId: novaUnidade.id, descricao: item.descricao, serial: serial.trim(), quantidade: 1, custoUnitario: item.custoUnitario, foto, data: agora, depositoId, depositoNome };
    await setRecebimentos([registro, ...recebimentos]);
    setEnviando(false);
    notify(`Unidade SN ${serial.trim()} recebida em ${depositoNome}`);
    if (pendente - 1 <= 0) { onDone(); } else { setSerial(''); setFoto(null); }
  }

  async function confirmarLote() {
    if (!depositoId) { notify('Selecione o depósito de destino'); return; }
    const qtd = parseInt(qtdInput) || 0;
    if (qtd <= 0 || qtd > pendente) { notify(`Informe uma quantidade entre 1 e ${pendente}`); return; }
    setEnviando(true);
    const agora = new Date().toISOString();
    const depositoNome = depositos.find(d => d.id === depositoId)?.nome || '';
    const novoLote = { id: uid(), quantidade: qtd, quantidadeDisponivel: qtd, custoUnitario: item.custoUnitario, notaFiscal: pedido.numeroNotaFiscal, fornecedor: pedido.fornecedorNome, dataEntrada: agora, depositoId };
    const novoEstoque = estoque.map(p => p.id === item.produtoId ? { ...p, lotes: [...(p.lotes || []), novoLote] } : p);
    await setEstoque(novoEstoque);
    const registro = { id: uid(), pedidoId: pedido.id, itemLineId: item.id, produtoId: item.produtoId, loteId: novoLote.id, descricao: item.descricao, serial: null, quantidade: qtd, custoUnitario: item.custoUnitario, foto, data: agora, depositoId, depositoNome };
    await setRecebimentos([registro, ...recebimentos]);
    setEnviando(false);
    notify('Entrada registrada no estoque');
    onDone();
  }

  const seletorDeposito = (
    <div>
      <label className="text-xs text-slate-500 flex items-center gap-1"><Warehouse size={12} /> Depósito de destino</label>
      <select value={depositoId} onChange={e => setDepositoId(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm mt-1">
        <option value="">Selecione o depósito...</option>
        {depositos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
      </select>
    </div>
  );

  if (item.serializado) {
    return (
      <div className="mt-3 bg-slate-50 border border-slate-200 rounded-md p-3 space-y-3">
        <p className="text-xs text-slate-500">Unidade {pendente > 0 ? `(faltam ${pendente})` : ''} — digite o número de série gravado na etiqueta do inversor e anexe a foto dela.</p>
        {seletorDeposito}
        <input value={serial} onChange={e => setSerial(e.target.value)} placeholder="Número de série do inversor" className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm font-mono" />
        <div>
          <label className="text-xs text-slate-500 flex items-center gap-1"><Camera size={12} /> Foto da etiqueta de série</label>
          <input type="file" accept="image/*" capture="environment" onChange={handleFoto} className="text-xs mt-1" />
          {foto && <img src={foto} alt="Prévia" className="w-20 h-20 object-cover rounded-md border border-slate-200 mt-2" />}
        </div>
        <div className="flex gap-2">
          <button onClick={confirmarUnidade} disabled={enviando} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-2 rounded-md disabled:opacity-50">
            <CheckCircle2 size={13} /> Confirmar esta unidade
          </button>
          <button onClick={onCancel} className="text-xs text-slate-500 px-3 py-2">Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-md p-3 space-y-3">
      {seletorDeposito}
      <div>
        <label className="text-xs text-slate-500">Quantidade recebida (máx. {pendente})</label>
        <input type="number" min={1} max={pendente} value={qtdInput} onChange={e => setQtdInput(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm mt-1" />
      </div>
      <div>
        <label className="text-xs text-slate-500 flex items-center gap-1"><Camera size={12} /> Foto (opcional)</label>
        <input type="file" accept="image/*" capture="environment" onChange={handleFoto} className="text-xs mt-1" />
        {foto && <img src={foto} alt="Prévia" className="w-20 h-20 object-cover rounded-md border border-slate-200 mt-2" />}
      </div>
      <div className="flex gap-2">
        <button onClick={confirmarLote} disabled={enviando} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-2 rounded-md disabled:opacity-50">
          <CheckCircle2 size={13} /> Confirmar recebimento
        </button>
        <button onClick={onCancel} className="text-xs text-slate-500 px-3 py-2">Cancelar</button>
      </div>
    </div>
  );
}

/* ---------------- SENHA DE APROVAÇÃO (protege apagar lançamentos) ---------------- */

function SenhaAprovacaoModule({ senhaAprovacao, setSenhaAprovacao, notify }) {
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmaNova, setConfirmaNova] = useState('');

  const jaTemSenha = !!senhaAprovacao?.senha;

  async function salvar() {
    if (jaTemSenha && atual !== senhaAprovacao.senha) { notify('Senha atual incorreta'); return; }
    if (!nova.trim()) { notify('Digite a nova senha'); return; }
    if (nova !== confirmaNova) { notify('A confirmação não confere com a nova senha'); return; }
    await setSenhaAprovacao({ senha: nova, atualizadoEm: new Date().toISOString() });
    notify(jaTemSenha ? 'Senha de aprovação atualizada' : 'Senha de aprovação cadastrada');
    setAtual(''); setNova(''); setConfirmaNova('');
  }

  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">Essa senha é exigida para apagar lançamentos (transferência, venda, orçamento, pedido de compra e recebimento) — uma trava extra contra exclusões acidentais.</p>
      <div className="bg-white border border-slate-200 rounded-lg p-4 max-w-sm space-y-3">
        <h3 className="font-medium text-sm">{jaTemSenha ? 'Alterar senha de aprovação' : 'Cadastrar senha de aprovação'}</h3>
        {jaTemSenha && (
          <input type="password" placeholder="Senha atual" value={atual} onChange={e => setAtual(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
        )}
        <input type="password" placeholder="Nova senha" value={nova} onChange={e => setNova(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
        <input type="password" placeholder="Confirmar nova senha" value={confirmaNova} onChange={e => setConfirmaNova(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
        <button onClick={salvar} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800">Salvar</button>
        {jaTemSenha && senhaAprovacao.atualizadoEm && (
          <p className="text-[11px] text-slate-400">Última atualização: {formatDate(senhaAprovacao.atualizadoEm)}</p>
        )}
      </div>
    </div>
  );
}

/* ---------------- FORMAS DE RECEBIMENTO (opções de pagamento) ---------------- */

function FormasRecebimentoModule({ formasRecebimento, setFormasRecebimento, askConfirm, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [multipla, setMultipla] = useState(false);

  async function handleAdd() {
    if (!nome.trim()) { notify('Digite o nome da forma de recebimento'); return; }
    await setFormasRecebimento([...formasRecebimento, { id: uid(), nome: nome.trim(), multipla }]);
    notify('Forma de recebimento cadastrada');
    setNome(''); setMultipla(false); setShowForm(false);
  }

  async function handleDelete(id) {
    if (!(await askConfirm('Remover esta forma de recebimento?'))) return;
    await setFormasRecebimento(formasRecebimento.filter(f => f.id !== id));
    notify('Forma de recebimento removida');
  }

  return (
    <div>
      <p className="text-xs text-slate-400 mb-3">Essas opções aparecem na hora de anexar o comprovante de pagamento, na aba Vendas.</p>
      <div className="flex justify-end mb-3">
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
          <Plus size={16} /> Nova forma de recebimento
        </button>
      </div>
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">Nova forma de recebimento</h3>
            <button onClick={() => setShowForm(false)}><X size={16} className="text-slate-400" /></button>
          </div>
          <input placeholder="Ex: Pix Fulano, Cartão de Débito..." value={nome} onChange={e => setNome(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <input type="checkbox" checked={multipla} onChange={e => setMultipla(e.target.checked)} />
            Marcar como "múltiplas formas de pagamento" (permite anexar vários comprovantes na mesma venda)
          </label>
          <button type="button" onClick={handleAdd} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800">Salvar</button>
        </div>
      )}
      <div className="space-y-2">
        {formasRecebimento.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhuma forma de recebimento cadastrada.</p>}
        {formasRecebimento.map(f => (
          <div key={f.id} className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-center gap-2">
            <p className="text-sm text-slate-700 flex items-center gap-1.5">
              {f.nome}
              {f.multipla && <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">múltiplas</span>}
            </p>
            <button onClick={() => handleDelete(f.id)}><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- CLIENTES ---------------- */

function ClientesModule({ clientes, setClientes, askConfirm, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(emptyForm());
  const [editandoClienteId, setEditandoClienteId] = useState(null);
  function emptyForm() { return { nome: '', documento: '', telefone: '', email: '', endereco: '', cidade: '', uc: '', observacoes: '' }; }
  function resetForm() { setForm(emptyForm()); setEditandoClienteId(null); setShowForm(false); }

  function abrirEdicaoCliente(c) {
    setForm({
      nome: c.nome || '', documento: c.documento || '', telefone: c.telefone || '', email: c.email || '',
      endereco: c.endereco || '', cidade: c.cidade || '', uc: c.uc || '', observacoes: c.observacoes || '',
    });
    setEditandoClienteId(c.id);
    setShowForm(true);
  }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.nome) { notify('Preencha o nome do cliente antes de salvar'); return; }
    if (editandoClienteId) {
      await setClientes(clientes.map(c => c.id === editandoClienteId ? { ...c, ...form } : c));
      notify('Cliente atualizado');
    } else {
      await setClientes([{ id: uid(), ...form }, ...clientes]);
      notify('Cliente cadastrado');
    }
    resetForm();
  }
  async function handleDelete(id) {
    if (!(await askConfirm('Remover este cliente?'))) return;
    await setClientes(clientes.filter(c => c.id !== id));
    notify('Cliente removido');
  }
  const filtrado = clientes.filter(c => `${c.nome} ${c.documento} ${c.cidade}`.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar cliente..." className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <button onClick={() => { resetForm(); setShowForm(s => !s); }} className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
          <Plus size={16} /> Novo cliente
        </button>
      </div>
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">{editandoClienteId ? 'Editar cliente' : 'Novo cliente'}</h3>
            <button type="button" onClick={resetForm}><X size={16} className="text-slate-400" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <input placeholder="Nome completo / Razão social" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm sm:col-span-2" />
            <input placeholder="CPF/CNPJ" value={form.documento} onChange={e => setForm(f => ({ ...f, documento: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="Telefone" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="E-mail" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="UC (unidade consumidora)" value={form.uc} onChange={e => setForm(f => ({ ...f, uc: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="Endereço" value={form.endereco} onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm sm:col-span-2" />
            <input placeholder="Cidade/UF" value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder="Observações" value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
          </div>
          <button type="button" onClick={handleAdd} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800">{editandoClienteId ? 'Salvar alterações' : 'Salvar cliente'}</button>
        </div>
      )}
      <div className="space-y-2">
        {filtrado.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum cliente encontrado.</p>}
        {filtrado.map(c => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-start gap-2">
            <div className="min-w-0">
              <p className="font-medium text-sm truncate">{c.nome}</p>
              <p className="text-xs text-slate-500">{[c.documento, c.telefone, c.cidade].filter(Boolean).join(' · ')}</p>
              {c.uc && <p className="text-xs text-slate-400">UC: {c.uc}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => abrirEdicaoCliente(c)} title="Editar cliente"><Pencil size={14} className="text-slate-300 hover:text-slate-600" /></button>
              <button onClick={() => handleDelete(c.id)} title="Remover cliente"><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- ORÇAMENTOS (carrinho que não baixa estoque até ser convertido) ---------------- */

function OrcamentoModule({ orcamentos, setOrcamentos, vendas, setVendas, clientes, estoque, setEstoque, depositos, askConfirm, askSenha, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [clienteId, setClienteId] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [observacoes, setObservacoes] = useState('');
  const [expanded, setExpanded] = useState({});

  function novoOrcamento() { setEditingId(null); setClienteId(''); setCarrinho([]); setObservacoes(''); setShowForm(true); }
  function editarOrcamento(orc) { setEditingId(orc.id); setClienteId(orc.clienteId); setCarrinho(orc.itens.map(i => ({ ...i }))); setObservacoes(orc.observacoes || ''); setShowForm(true); }
  function cancelarForm() { setShowForm(false); setEditingId(null); setClienteId(''); setCarrinho([]); setObservacoes(''); }

  const total = carrinho.reduce((acc, it) => acc + it.precoVendaUnitario * it.quantidade, 0);

  async function salvarOrcamento() {
    if (!clienteId || carrinho.length === 0) { notify('Selecione o cliente e adicione ao menos um item'); return; }
    const cliente = clientes.find(c => c.id === clienteId);
    if (editingId) {
      const next = orcamentos.map(o => o.id === editingId ? { ...o, clienteId, clienteNome: cliente?.nome || o.clienteNome, itens: carrinho, total, observacoes } : o);
      await setOrcamentos(next);
      notify('Orçamento atualizado');
    } else {
      const novo = { id: uid(), clienteId, clienteNome: cliente?.nome || 'Cliente removido', data: new Date().toISOString(), itens: carrinho, total, observacoes, status: 'Aberto', vendaId: null };
      await setOrcamentos([novo, ...orcamentos]);
      notify('Orçamento salvo');
    }
    cancelarForm();
  }

  async function cancelarOrcamento(id) {
    if (!(await askConfirm('Cancelar este orçamento?'))) return;
    await setOrcamentos(orcamentos.map(o => o.id === id ? { ...o, status: 'Cancelado' } : o));
    notify('Orçamento cancelado');
  }

  async function apagarOrcamento(orc) {
    if (orc.anulado) return;
    const ok = await askSenha(`Apagar o orçamento de ${orc.clienteNome} (${currency(orc.total)})? Ele ficará marcado como anulado no histórico.`);
    if (!ok) return;
    await setOrcamentos(orcamentos.map(o => o.id === orc.id ? { ...o, anulado: true, anuladoEm: new Date().toISOString() } : o));
    notify('Orçamento anulado');
  }

  async function converterEmVenda(orc) {
    if (!(await askConfirm(`Converter o orçamento de ${orc.clienteNome} (${currency(orc.total)}) em venda? Isso vai dar baixa no estoque.`))) return;
    const { novoEstoque, itensResultado, totalCusto, erros } = consumirEstoque(estoque, orc.itens);
    if (erros.length > 0) { notify(`Não foi possível converter: ${erros[0]}`); return; }
    await setEstoque(novoEstoque);
    const venda = { id: uid(), clienteId: orc.clienteId, clienteNome: orc.clienteNome, data: new Date().toISOString(), itens: itensResultado, totalVenda: orc.total, totalCusto, origemOrcamentoId: orc.id, observacoes: orc.observacoes || '' };
    await setVendas([venda, ...vendas]);
    await setOrcamentos(orcamentos.map(o => o.id === orc.id ? { ...o, status: 'Convertido', vendaId: venda.id } : o));
    notify('Orçamento convertido em venda e estoque atualizado');
  }

  function gerarDocumentoOrcamento(orc, formato) {
    const cliente = clientes.find(c => c.id === orc.clienteId) || { nome: orc.clienteNome };
    baixarDocumento({
      titulo: 'PROPOSTA / ORÇAMENTO',
      numeroLabel: 'Orçamento Nº',
      numero: orc.id.slice(-6).toUpperCase(),
      data: formatDate(orc.data),
      cliente,
      itens: orc.itens.map(it => ({
        descricao: it.serial ? `${it.descricao} (SN ${it.serial})` : it.descricao,
        quantidade: it.quantidade, precoUnitario: it.precoVendaUnitario, subtotal: it.precoVendaUnitario * it.quantidade,
      })),
      totalLabel: 'Valor total da proposta',
      totalValor: orc.total,
      observacoes: 'Proposta sujeita à disponibilidade de estoque no momento do fechamento.',
    }, `orcamento-${(orc.clienteNome || 'cliente').replace(/\s+/g, '-').toLowerCase()}`, formato);
  }

  function statusBadge(status) {
    const styles = { Aberto: 'bg-slate-100 text-slate-600', Convertido: 'bg-emerald-100 text-emerald-700', Cancelado: 'bg-red-100 text-red-600' };
    return <span className={`text-[11px] px-1.5 py-0.5 rounded ${styles[status]}`}>{status}</span>;
  }

  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('recente');

  const orcamentosFiltrados = useMemo(() => {
    let lista = orcamentos.filter(o => o.clienteNome.toLowerCase().includes(busca.toLowerCase()));
    if (filtroStatus !== 'Todos') lista = lista.filter(o => o.status === filtroStatus);
    return lista.slice().sort((a, b) => {
      switch (ordenacao) {
        case 'recente': return new Date(b.data) - new Date(a.data);
        case 'antigo': return new Date(a.data) - new Date(b.data);
        case 'valorDesc': return b.total - a.total;
        case 'valorAsc': return a.total - b.total;
        case 'cliente': return a.clienteNome.localeCompare(b.clienteNome, 'pt-BR');
        default: return 0;
      }
    });
  }, [orcamentos, busca, filtroStatus, ordenacao]);

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button onClick={novoOrcamento} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
          <Plus size={16} /> Novo orçamento
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">{editingId ? 'Editar orçamento' : 'Novo orçamento'}</h3>
            <button onClick={cancelarForm}><X size={16} className="text-slate-400" /></button>
          </div>
          <p className="text-xs text-slate-400 -mt-2">Um orçamento não reserva nem dá baixa no estoque — isso só acontece quando ele é convertido em venda.</p>
          <select value={clienteId} onChange={e => setClienteId(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm">
            <option value="">Selecione o cliente...</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>

          <CarrinhoEditor estoque={estoque} depositos={depositos} carrinho={carrinho} setCarrinho={setCarrinho} notify={notify} />

          <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Observações da negociação (condições combinadas, prazo, forma de pagamento acertada, detalhes de instalação etc.) — ficam visíveis pra quem for tocar as próximas etapas, inclusive a expedição." rows={3} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm resize-none" />

          <button onClick={salvarOrcamento} disabled={!clienteId || carrinho.length === 0} className="w-full bg-amber-500 disabled:opacity-30 hover:bg-amber-600 text-slate-900 font-medium text-sm px-4 py-2 rounded-md">
            {editingId ? 'Salvar alterações' : 'Salvar orçamento'}
          </button>
        </div>
      )}

      <h3 className="text-sm font-medium text-slate-500 mb-2">Orçamentos</h3>
      <FiltroBar
        busca={busca} setBusca={setBusca} buscaPlaceholder="Buscar por cliente..."
        filtroValue={filtroStatus} setFiltro={setFiltroStatus}
        filtroOptions={[{ value: 'Todos', label: 'Todos os status' }, { value: 'Aberto', label: 'Aberto' }, { value: 'Convertido', label: 'Convertido' }, { value: 'Cancelado', label: 'Cancelado' }]}
        ordenacaoValue={ordenacao} setOrdenacao={setOrdenacao}
        ordenacaoOptions={[{ value: 'recente', label: 'Mais recente primeiro' }, { value: 'antigo', label: 'Mais antigo primeiro' }, { value: 'valorDesc', label: 'Maior valor primeiro' }, { value: 'valorAsc', label: 'Menor valor primeiro' }, { value: 'cliente', label: 'Cliente (A-Z)' }]}
      />
      <div className="space-y-2">
        {orcamentos.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum orçamento criado.</p>}
        {orcamentos.length > 0 && orcamentosFiltrados.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum orçamento encontrado com esse filtro.</p>}
        {orcamentosFiltrados.map(o => (
          <div key={o.id} className={`bg-white border rounded-lg overflow-hidden ${o.anulado ? 'border-red-200 opacity-60' : 'border-slate-200'}`}>
            <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpanded(x => ({ ...x, [o.id]: !x[o.id] }))}>
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expanded[o.id] ? 'rotate-90' : ''}`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate flex items-center gap-1.5">
                    <span className={o.anulado ? 'line-through' : ''}>{o.clienteNome}</span> {statusBadge(o.status)}
                    {o.anulado && <span className="text-[11px] px-1.5 py-0.5 rounded bg-red-100 text-red-600">Anulado</span>}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(o.data)} · {o.itens.length} item(ns) {o.anulado && `· anulado em ${formatDate(o.anuladoEm)}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-medium text-sm">{currency(o.total)}</span>
                {!o.anulado && <button onClick={(e) => { e.stopPropagation(); apagarOrcamento(o); }} title="Apagar lançamento"><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>}
              </div>
            </div>
            {expanded[o.id] && (
              <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 space-y-2">
                <div className="space-y-1">
                  {o.itens.map((it, i) => (
                    <p key={i} className="text-xs text-slate-600">{it.descricao} {it.serial && <span className="font-mono text-slate-400">· SN {it.serial}</span>} — {it.quantidade}x {currency(it.precoVendaUnitario)}</p>
                  ))}
                </div>
                {o.observacoes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-2">
                    <p className="text-[11px] text-amber-700 font-medium mb-0.5">Observações da negociação</p>
                    <p className="text-xs text-amber-800 whitespace-pre-wrap">{o.observacoes}</p>
                  </div>
                )}
                {o.status === 'Aberto' && !o.anulado && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => editarOrcamento(o)} className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-md"><Pencil size={12} /> Editar</button>
                    <button onClick={() => converterEmVenda(o)} className="flex items-center gap-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-md"><ArrowRightCircle size={12} /> Converter em venda</button>
                    <button onClick={() => cancelarOrcamento(o.id)} className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-md"><Ban size={12} /> Cancelar</button>
                  </div>
                )}
                <div className="flex gap-2 pt-1">
                  <span className="text-[11px] text-slate-400 self-center">Gerar documento:</span>
                  <button onClick={() => gerarDocumentoOrcamento(o, 'jpg')} className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-md"><FileText size={12} /> JPG</button>
                  <button onClick={() => gerarDocumentoOrcamento(o, 'pdf')} className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-md"><FileText size={12} /> PDF</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- VENDAS (com baixa FIFO de custo) ---------------- */

function VendasModule({ vendas, setVendas, clientes, estoque, setEstoque, depositos, orcamentos, setOrcamentos, formasRecebimento, expedicoes, setExpedicoes, askConfirm, askSenha, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [clienteId, setClienteId] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [observacoes, setObservacoes] = useState('');
  const [expanded, setExpanded] = useState({});
  const [orcamentoOrigemId, setOrcamentoOrigemId] = useState('');

  const orcamentosAbertos = (orcamentos || []).filter(o => o.status === 'Aberto');
  const total = carrinho.reduce((acc, it) => acc + it.precoVendaUnitario * it.quantidade, 0);

  function importarOrcamento(id) {
    setOrcamentoOrigemId(id);
    if (!id) return;
    const orc = orcamentosAbertos.find(o => o.id === id);
    if (!orc) return;
    setClienteId(orc.clienteId);
    setCarrinho(orc.itens.map(i => ({ ...i })));
    setObservacoes(orc.observacoes || '');
    notify(`Itens do orçamento de ${orc.clienteNome} importados — confira antes de finalizar`);
  }

  function resetForm() { setCarrinho([]); setClienteId(''); setObservacoes(''); setOrcamentoOrigemId(''); setShowForm(false); }

  const [busca, setBusca] = useState('');
  const [filtroComprovante, setFiltroComprovante] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('recente');

  const [filtroAnulado, setFiltroAnulado] = useState('Todas');
  const vendasFiltradas = useMemo(() => {
    let lista = vendas.filter(v => v.clienteNome.toLowerCase().includes(busca.toLowerCase()));
    if (filtroComprovante === 'Com') lista = lista.filter(v => (v.comprovantes || []).length > 0);
    if (filtroComprovante === 'Sem') lista = lista.filter(v => !(v.comprovantes || []).length);
    if (filtroAnulado === 'Ativas') lista = lista.filter(v => !v.anulado);
    if (filtroAnulado === 'Anuladas') lista = lista.filter(v => v.anulado);
    return lista.slice().sort((a, b) => {
      switch (ordenacao) {
        case 'recente': return new Date(b.data) - new Date(a.data);
        case 'antigo': return new Date(a.data) - new Date(b.data);
        case 'valorDesc': return b.totalVenda - a.totalVenda;
        case 'valorAsc': return a.totalVenda - b.totalVenda;
        case 'cliente': return a.clienteNome.localeCompare(b.clienteNome, 'pt-BR');
        default: return 0;
      }
    });
  }, [vendas, busca, filtroComprovante, filtroAnulado, ordenacao]);

  async function finalizarVenda() {
    if (!clienteId || carrinho.length === 0) return;
    const cliente = clientes.find(c => c.id === clienteId);
    const { novoEstoque, itensResultado, totalCusto, erros } = consumirEstoque(estoque, carrinho);
    if (erros.length > 0) { notify(erros[0]); return; }
    await setEstoque(novoEstoque);
    const venda = { id: uid(), clienteId, clienteNome: cliente?.nome || 'Cliente removido', data: new Date().toISOString(), itens: itensResultado, totalVenda: total, totalCusto, origemOrcamentoId: orcamentoOrigemId || undefined, observacoes };
    await setVendas([venda, ...vendas]);
    if (orcamentoOrigemId && setOrcamentos) {
      await setOrcamentos(orcamentos.map(o => o.id === orcamentoOrigemId ? { ...o, status: 'Convertido', vendaId: venda.id } : o));
    }
    notify('Venda registrada e estoque atualizado');
    resetForm();
  }

  async function apagarVenda(venda) {
    if (venda.anulado) return;
    const ok = await askSenha(`Apagar a venda de ${venda.clienteNome} (${currency(venda.totalVenda)})? Os itens voltam ao estoque disponível, as expedições vinculadas serão removidas, e o lançamento ficará marcado como anulado no histórico. Comprovantes anexados também serão perdidos.`);
    if (!ok) return;

    const novoEstoque = reverterConsumoEstoque(estoque, venda.itens);
    await setEstoque(novoEstoque);

    if (setExpedicoes) {
      const chavesDaVenda = new Set(venda.itens.map(it => chaveItemVenda(venda.id, it)));
      await setExpedicoes(expedicoes.filter(ex => !chavesDaVenda.has(ex.chave)));
    }

    if (venda.origemOrcamentoId && setOrcamentos) {
      await setOrcamentos(orcamentos.map(o => o.id === venda.origemOrcamentoId ? { ...o, status: 'Aberto', vendaId: null } : o));
    }

    await setVendas(vendas.map(v => v.id === venda.id ? { ...v, anulado: true, anuladoEm: new Date().toISOString(), comprovantes: [] } : v));
    notify('Venda anulada e estoque devolvido');
  }

  function gerarReciboVenda(venda, formato) {
    const cliente = clientes.find(c => c.id === venda.clienteId) || { nome: venda.clienteNome };
    const extraLinhas = (venda.comprovantes || [])
      .filter(c => c.valor > 0)
      .map(c => `${c.formaRecebimentoNome || 'Pagamento'}: ${currency(c.valor)}`);
    baixarDocumento({
      titulo: 'RECIBO DE VENDA',
      numeroLabel: 'Venda Nº',
      numero: venda.id.slice(-6).toUpperCase(),
      data: formatDate(venda.data),
      cliente,
      itens: venda.itens.map(it => ({
        descricao: it.serial ? `${it.descricao} (SN ${it.serial})` : it.descricao,
        quantidade: it.quantidade, precoUnitario: it.precoVendaUnitario, subtotal: it.precoVendaUnitario * it.quantidade,
      })),
      totalLabel: 'Valor total recebido',
      totalValor: venda.totalVenda,
      extraLinhas: extraLinhas.length ? extraLinhas : undefined,
      observacoes: 'Recibo referente à negociação descrita acima.',
    }, `recibo-venda-${(venda.clienteNome || 'cliente').replace(/\s+/g, '-').toLowerCase()}`, formato);
  }

  async function anexarComprovante(vendaId, file, formaId, formaNome, valor) {
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const dataUrl = isImage ? await fileToCompressedDataUrl(file) : await fileToDataUrl(file);
    const comprovante = { id: uid(), nome: file.name, tipo: file.type, dataUrl, data: new Date().toISOString(), formaRecebimentoId: formaId || null, formaRecebimentoNome: formaNome || '', valor: valor || 0 };
    const next = vendas.map(v => {
      if (v.id !== vendaId) return v;
      const comprovantes = [...(v.comprovantes || []), comprovante];
      const totalComprovado = comprovantes.reduce((acc, c) => acc + (c.valor || 0), 0);
      const quitado = totalComprovado >= v.totalVenda - 0.01;
      return { ...v, comprovantes, quitado, quitadoEm: quitado ? (v.quitadoEm || new Date().toISOString()) : null };
    });
    await setVendas(next);
    const vendaAtualizada = next.find(v => v.id === vendaId);
    notify(vendaAtualizada?.quitado ? 'Comprovante anexado — venda quitada!' : 'Comprovante de pagamento anexado');
  }

  async function removerComprovante(vendaId, comprovanteId) {
    if (!(await askConfirm('Remover este comprovante?'))) return;
    const next = vendas.map(v => {
      if (v.id !== vendaId) return v;
      const comprovantes = (v.comprovantes || []).filter(c => c.id !== comprovanteId);
      const totalComprovado = comprovantes.reduce((acc, c) => acc + (c.valor || 0), 0);
      const quitado = totalComprovado >= v.totalVenda - 0.01;
      return { ...v, comprovantes, quitado, quitadoEm: quitado ? v.quitadoEm : null };
    });
    await setVendas(next);
    notify('Comprovante removido');
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
          <Plus size={16} /> Nova venda
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">Nova venda</h3>
            <button onClick={resetForm}><X size={16} className="text-slate-400" /></button>
          </div>

          {orcamentosAbertos.length > 0 && (
            <div className="border border-dashed border-slate-200 rounded-md p-3">
              <label className="text-xs text-slate-500 flex items-center gap-1"><ClipboardCheck size={12} /> Importar de um orçamento aberto (opcional)</label>
              <select value={orcamentoOrigemId} onChange={e => importarOrcamento(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm mt-1">
                <option value="">Começar do zero...</option>
                {orcamentosAbertos.map(o => <option key={o.id} value={o.id}>{o.clienteNome} — {currency(o.total)} · {formatDate(o.data)}</option>)}
              </select>
              {orcamentoOrigemId && <p className="text-[11px] text-emerald-600 mt-1">Itens importados. Ao finalizar, o orçamento será marcado como convertido.</p>}
            </div>
          )}

          <select value={clienteId} onChange={e => setClienteId(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm">
            <option value="">Selecione o cliente...</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>

          <CarrinhoEditor estoque={estoque} depositos={depositos} carrinho={carrinho} setCarrinho={setCarrinho} notify={notify} />

          <textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Observações da negociação (condições combinadas, prazo, forma de pagamento acertada, detalhes de instalação etc.) — ficam visíveis pra quem for tocar as próximas etapas, inclusive a expedição." rows={3} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm resize-none" />

          <button onClick={finalizarVenda} disabled={!clienteId || carrinho.length === 0} className="w-full bg-amber-500 disabled:opacity-30 hover:bg-amber-600 text-slate-900 font-medium text-sm px-4 py-2 rounded-md">
            Finalizar venda
          </button>
        </div>
      )}

      <h3 className="text-sm font-medium text-slate-500 mb-2">Histórico de vendas</h3>
      <FiltroBar
        busca={busca} setBusca={setBusca} buscaPlaceholder="Buscar por cliente..."
        filtroValue={filtroComprovante} setFiltro={setFiltroComprovante}
        filtroOptions={[{ value: 'Todos', label: 'Todas as vendas' }, { value: 'Com', label: 'Com comprovante' }, { value: 'Sem', label: 'Sem comprovante' }]}
        ordenacaoValue={ordenacao} setOrdenacao={setOrdenacao}
        ordenacaoOptions={[{ value: 'recente', label: 'Mais recente primeiro' }, { value: 'antigo', label: 'Mais antigo primeiro' }, { value: 'valorDesc', label: 'Maior valor primeiro' }, { value: 'valorAsc', label: 'Menor valor primeiro' }, { value: 'cliente', label: 'Cliente (A-Z)' }]}
      />
      <div className="flex gap-2 mb-3 -mt-1">
        {[['Todas', 'Todas'], ['Ativas', 'Só ativas'], ['Anuladas', 'Só anuladas']].map(([v, l]) => (
          <button key={v} onClick={() => setFiltroAnulado(v)} className={`text-xs px-3 py-1 rounded-full border ${filtroAnulado === v ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500'}`}>{l}</button>
        ))}
      </div>
      <div className="space-y-2">
        {vendas.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhuma venda registrada.</p>}
        {vendas.length > 0 && vendasFiltradas.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhuma venda encontrada com esse filtro.</p>}
        {vendasFiltradas.map(v => (
          <div key={v.id} className={`bg-white border rounded-lg overflow-hidden ${v.anulado ? 'border-red-200 opacity-60' : 'border-slate-200'}`}>
            <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpanded(x => ({ ...x, [v.id]: !x[v.id] }))}>
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expanded[v.id] ? 'rotate-90' : ''}`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate flex items-center gap-1.5">
                    <span className={v.anulado ? 'line-through' : ''}>{v.clienteNome}</span> {v.origemOrcamentoId && <span className="text-[11px] text-slate-400 font-normal">(via orçamento)</span>}
                    {v.anulado && <span className="text-[11px] px-1.5 py-0.5 rounded bg-red-100 text-red-600">Anulado</span>}
                    {!v.anulado && v.quitado && <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">Quitado</span>}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(v.data)} · {v.itens.length} item(ns) {v.anulado && `· anulado em ${formatDate(v.anuladoEm)}`} {!v.anulado && v.quitado && v.quitadoEm && `· quitado em ${formatDate(v.quitadoEm)}`}</p>
                </div>
              </div>
              <span className="font-medium text-sm shrink-0 flex items-center gap-1.5">
                {(() => {
                  const totalComprovado = (v.comprovantes || []).reduce((acc, c) => acc + (c.valor || 0), 0);
                  if (v.quitado || totalComprovado >= v.totalVenda - 0.01) return <CheckCircle2 size={13} className="text-emerald-500" title="Quitado" />;
                  if (totalComprovado > 0) return <FileText size={13} className="text-amber-500" title="Pagamento parcial" />;
                  return <FileText size={13} className="text-slate-300" title="Sem comprovante" />;
                })()}
                {currency(v.totalVenda)}
              </span>
              {!v.anulado && <button onClick={(e) => { e.stopPropagation(); apagarVenda(v); }} title="Apagar lançamento"><Trash2 size={14} className="text-slate-300 hover:text-red-500 ml-2" /></button>}
            </div>
            {expanded[v.id] && (
              <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 space-y-1">
                {v.itens.map((it, i) => (
                  <p key={i} className="text-xs text-slate-600">{it.descricao} {it.serial && <span className="font-mono text-slate-400">· SN {it.serial}</span>} — {it.quantidade}x {currency(it.precoVendaUnitario)}</p>
                ))}

                {v.observacoes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-2 mt-1">
                    <p className="text-[11px] text-amber-700 font-medium mb-0.5">Observações da negociação</p>
                    <p className="text-xs text-amber-800 whitespace-pre-wrap">{v.observacoes}</p>
                  </div>
                )}

                <div className="pt-2 mt-2 border-t border-slate-200">
                  <p className="text-xs text-slate-500 font-medium mb-1.5">Comprovante de pagamento</p>
                  {(v.comprovantes || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {v.comprovantes.map(c => (
                        <div key={c.id} className="relative w-16">
                          {c.tipo.startsWith('image/') ? (
                            <a href={c.dataUrl} target="_blank" rel="noreferrer">
                              <img src={c.dataUrl} alt={c.nome} className="w-16 h-16 object-cover rounded-md border border-slate-200" />
                            </a>
                          ) : (
                            <a href={c.dataUrl} download={c.nome} className="w-16 h-16 flex flex-col items-center justify-center gap-1 rounded-md border border-slate-200 bg-white text-slate-500">
                              <FileText size={18} />
                              <span className="text-[9px]">PDF</span>
                            </a>
                          )}
                          {c.formaRecebimentoNome && <p className="text-[9px] text-slate-500 text-center mt-0.5 leading-tight truncate" title={c.formaRecebimentoNome}>{c.formaRecebimentoNome}</p>}
                          {c.valor > 0 && <p className="text-[9px] text-emerald-600 text-center leading-tight">{currency(c.valor)}</p>}
                          <button onClick={() => removerComprovante(v.id, c.id)} className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white rounded-full w-4 h-4 flex items-center justify-center"><X size={10} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <ComprovanteUploader vendaId={v.id} formasRecebimento={formasRecebimento} valorTotalVenda={v.totalVenda} valorJaAnexado={(v.comprovantes || []).reduce((acc, c) => acc + (c.valor || 0), 0)} onAnexar={anexarComprovante} notify={notify} />
                </div>
                <div className="flex gap-2 pt-2 mt-2 border-t border-slate-200">
                  <span className="text-[11px] text-slate-400 self-center">Gerar recibo:</span>
                  <button onClick={() => gerarReciboVenda(v, 'jpg')} className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-md"><FileText size={12} /> JPG</button>
                  <button onClick={() => gerarReciboVenda(v, 'pdf')} className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-md"><FileText size={12} /> PDF</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- EXPEDIÇÃO (confirmação de entrega com fotos e nº de série) ---------------- */

/* ---------------- UPLOAD DE COMPROVANTE (com forma de recebimento) ---------------- */

function ComprovanteUploader({ vendaId, formasRecebimento, valorTotalVenda, valorJaAnexado, onAnexar, notify }) {
  const [formaId, setFormaId] = useState('');
  const [valorUnico, setValorUnico] = useState('');
  const [qtdMultipla, setQtdMultipla] = useState('');
  const [slots, setSlots] = useState(null); // array de { formaId, valor } quando "múltiplas formas" está ativo

  const formaSelecionada = formasRecebimento.find(f => f.id === formaId);
  const opcoesSimples = formasRecebimento.filter(f => !f.multipla);
  const restante = Math.max(0, (valorTotalVenda || 0) - (valorJaAnexado || 0));

  function confirmarQuantidade() {
    const n = parseInt(qtdMultipla) || 0;
    if (n < 2) { notify('Informe pelo menos 2 formas de pagamento'); return; }
    setSlots(Array.from({ length: n }, () => ({ formaId: '', valor: '' })));
  }

  function atualizarSlot(idx, campo, valor) {
    setSlots(s => s.map((slot, i) => i === idx ? { ...slot, [campo]: valor } : slot));
  }

  async function anexarSlot(idx, file) {
    const slot = slots[idx];
    const forma = formasRecebimento.find(f => f.id === slot.formaId);
    if (!forma) { notify('Selecione a forma de pagamento desta parcela antes de anexar o arquivo'); return; }
    const valor = parseValorBR(slot.valor);
    if (isNaN(valor) || valor <= 0) { notify('Informe o valor pago nessa parcela antes de anexar'); return; }
    if (valor > restante + 0.01) { notify(`Esse valor (${currency(valor)}) é maior que o restante a comprovar (${currency(restante)})`); return; }
    await onAnexar(vendaId, file, forma.id, forma.nome, valor);
  }

  function resetar() {
    setFormaId(''); setValorUnico(''); setQtdMultipla(''); setSlots(null);
  }

  const somaSlots = (slots || []).reduce((acc, s) => acc + (parseValorBR(s.valor) || 0), 0);

  if (slots) {
    return (
      <div className="border border-dashed border-slate-200 rounded-md p-3 space-y-2">
        <div className="flex justify-between items-center">
          <p className="text-xs text-slate-500 font-medium">{slots.length} formas de pagamento</p>
          <button onClick={resetar} className="text-[11px] text-slate-400 hover:text-slate-600">Cancelar</button>
        </div>
        {slots.map((slot, idx) => (
          <div key={idx} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <span className="text-xs text-slate-400 w-16 shrink-0">Parte {idx + 1}</span>
            <select value={slot.formaId} onChange={e => atualizarSlot(idx, 'formaId', e.target.value)} className="border border-slate-200 rounded-md px-2 py-1.5 text-xs flex-1">
              <option value="">Forma de pagamento...</option>
              {opcoesSimples.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
            <input type="text" inputMode="decimal" placeholder="Valor (R$)" value={slot.valor} onChange={e => atualizarSlot(idx, 'valor', e.target.value)} className="border border-slate-200 rounded-md px-2 py-1.5 text-xs sm:w-28" />
            <label className="inline-flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1.5 rounded-md cursor-pointer whitespace-nowrap">
              <Camera size={11} /> Anexar
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => e.target.files[0] && anexarSlot(idx, e.target.files[0])} />
            </label>
          </div>
        ))}
        <p className={`text-[11px] ${Math.abs(somaSlots - restante) < 0.01 ? 'text-emerald-600' : 'text-amber-600'}`}>
          Soma das parcelas: {currency(somaSlots)} de {currency(restante)} restante(s)
        </p>
      </div>
    );
  }

  return (
    <div>
      {valorTotalVenda > 0 && restante <= 0.01 ? (
        <p className="text-xs text-emerald-600 font-medium flex items-center gap-1"><CheckCircle2 size={14} /> Quitado — valor total já comprovado</p>
      ) : (
        <>
          {valorTotalVenda > 0 && (
            <p className="text-[11px] text-slate-400 mb-1.5">Falta comprovar {currency(restante)} de {currency(valorTotalVenda)}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
            <select value={formaId} onChange={e => { setFormaId(e.target.value); setValorUnico(String(restante || '')); }} className="border border-slate-200 rounded-md px-2 py-1.5 text-xs">
              <option value="">Forma de recebimento...</option>
              {formasRecebimento.map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>

            {formaSelecionada && formaSelecionada.multipla ? (
              <>
                <input type="number" min={2} placeholder="Qtd. de formas" value={qtdMultipla} onChange={e => setQtdMultipla(e.target.value)} className="border border-slate-200 rounded-md px-2 py-1.5 text-xs w-28" />
                <button onClick={confirmarQuantidade} className="text-xs bg-slate-900 text-white px-2.5 py-1.5 rounded-md">Continuar</button>
              </>
            ) : formaSelecionada ? (
              <>
                <input type="text" inputMode="decimal" placeholder="Valor (R$)" value={valorUnico} onChange={e => setValorUnico(e.target.value)} className="border border-slate-200 rounded-md px-2 py-1.5 text-xs w-28" />
                <label className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer">
                  <Camera size={12} /> Anexar comprovante
                  <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => {
                    if (!e.target.files[0]) return;
                    const valor = parseValorBR(valorUnico);
                    if (isNaN(valor) || valor <= 0) { notify('Informe o valor pago antes de anexar'); return; }
                    if (valor > restante + 0.01) { notify(`Esse valor (${currency(valor)}) é maior que o restante a comprovar (${currency(restante)})`); return; }
                    onAnexar(vendaId, e.target.files[0], formaSelecionada.id, formaSelecionada.nome, valor);
                    resetar();
                  }} />
                </label>
              </>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- EXPEDIÇÃO (confirmação de entrega com fotos e nº de série) ---------------- */
function ExpedicaoModule({ vendas, estoque, expedicoes, setExpedicoes, notify }) {
  const regFor = (chave, etapa) => expedicoes.find(ex => ex.chave === chave && ex.etapa === etapa);

  const [busca, setBusca] = useState('');
  const [ordenacao, setOrdenacao] = useState('recente');

  const vendasFiltradas = useMemo(() => vendas.filter(v => !v.anulado && v.clienteNome.toLowerCase().includes(busca.toLowerCase())), [vendas, busca]);

  const itensClassificados = useMemo(() => {
    const aguardandoSaida = [];
    const emRota = [];
    const concluidos = [];
    for (const v of vendasFiltradas) {
      for (const it of v.itens) {
        const chave = chaveItemVenda(v.id, it);
        const saida = regFor(chave, 'saida');
        const entrega = regFor(chave, 'entrega');
        const entry = { venda: v, item: it, chave, saida, entrega };
        if (!saida) aguardandoSaida.push(entry);
        else if (!entrega) emRota.push(entry);
        else concluidos.push(entry);
      }
    }
    return { aguardandoSaida, emRota, concluidos };
  }, [vendasFiltradas, expedicoes]);

  function agruparPorVenda(lista) {
    const map = new Map();
    for (const entry of lista) {
      if (!map.has(entry.venda.id)) map.set(entry.venda.id, { venda: entry.venda, itens: [] });
      map.get(entry.venda.id).itens.push(entry);
    }
    const grupos = Array.from(map.values());
    return grupos.sort((a, b) => {
      switch (ordenacao) {
        case 'recente': return new Date(b.venda.data) - new Date(a.venda.data);
        case 'antigo': return new Date(a.venda.data) - new Date(b.venda.data);
        case 'cliente': return a.venda.clienteNome.localeCompare(b.venda.clienteNome, 'pt-BR');
        default: return 0;
      }
    });
  }

  const gruposSaida = agruparPorVenda(itensClassificados.aguardandoSaida);
  const gruposRota = agruparPorVenda(itensClassificados.emRota);
  const gruposConcluidos = agruparPorVenda(itensClassificados.concluidos);

  const [expandedGrupo, setExpandedGrupo] = useState({});
  const [formAtivo, setFormAtivo] = useState(null); // { chave, etapa }

  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">A expedição tem dupla verificação: primeiro a <strong>saída da empresa</strong>, depois a <strong>entrega ao cliente</strong> — cada etapa exige foto e, para inversores, confirmação do número de série. Só é possível expedir produtos que tiveram entrada e passaram pelo estoque.</p>

      <FiltroBar
        busca={busca} setBusca={setBusca} buscaPlaceholder="Buscar por cliente..."
        ordenacaoValue={ordenacao} setOrdenacao={setOrdenacao}
        ordenacaoOptions={[{ value: 'recente', label: 'Venda mais recente primeiro' }, { value: 'antigo', label: 'Venda mais antiga primeiro' }, { value: 'cliente', label: 'Cliente (A-Z)' }]}
      />

      <h3 className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-1.5"><TruckIcon size={14} /> Aguardando saída da empresa</h3>
      <div className="space-y-2 mb-6">
        {gruposSaida.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nada pendente de saída.</p>}
        {gruposSaida.map(g => (
          <div key={g.venda.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpandedGrupo(x => ({ ...x, [`s-${g.venda.id}`]: !x[`s-${g.venda.id}`] }))}>
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expandedGrupo[`s-${g.venda.id}`] ? 'rotate-90' : ''}`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate flex items-center gap-1.5">{g.venda.clienteNome} {g.venda.observacoes && <ClipboardList size={12} className="text-amber-500 shrink-0" />}</p>
                  <p className="text-xs text-slate-400">{formatDate(g.venda.data)} · {g.itens.length} item(ns) pendente(s)</p>
                </div>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 shrink-0">Aguardando saída</span>
            </div>
            {g.venda.observacoes && (
              <div className="mx-3 mb-2 bg-amber-50 border border-amber-200 rounded-md p-2">
                <p className="text-[11px] text-amber-700 font-medium mb-0.5">Observações da negociação</p>
                <p className="text-xs text-amber-800 whitespace-pre-wrap">{g.venda.observacoes}</p>
              </div>
            )}
            {expandedGrupo[`s-${g.venda.id}`] && (
              <div className="border-t border-slate-100 divide-y divide-slate-100">
                {g.itens.map(({ item, chave }) => (
                  <div key={chave} className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">{item.descricao} {item.serial && <span className="text-xs font-mono text-slate-400">· SN {item.serial}</span>}</p>
                        <p className="text-xs text-slate-400">{item.quantidade}x</p>
                      </div>
                      <button onClick={() => setFormAtivo({ chave, etapa: 'saida' })} className="flex items-center gap-1 text-xs bg-slate-900 text-white px-2.5 py-1.5 rounded-md">
                        <Camera size={12} /> Registrar saída
                      </button>
                    </div>
                    {formAtivo && formAtivo.chave === chave && formAtivo.etapa === 'saida' && (
                      <ExpedicaoEtapaForm
                        etapa="saida"
                        vendaId={g.venda.id}
                        item={item}
                        estoque={estoque}
                        expedicoes={expedicoes}
                        setExpedicoes={setExpedicoes}
                        notify={notify}
                        onDone={() => setFormAtivo(null)}
                        onCancel={() => setFormAtivo(null)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-1.5"><PackageCheck size={14} /> Em rota — aguardando confirmação de entrega</h3>
      <div className="space-y-2 mb-6">
        {gruposRota.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nada em rota no momento.</p>}
        {gruposRota.map(g => (
          <div key={g.venda.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpandedGrupo(x => ({ ...x, [`r-${g.venda.id}`]: !x[`r-${g.venda.id}`] }))}>
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expandedGrupo[`r-${g.venda.id}`] ? 'rotate-90' : ''}`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate flex items-center gap-1.5">{g.venda.clienteNome} {g.venda.observacoes && <ClipboardList size={12} className="text-amber-500 shrink-0" />}</p>
                  <p className="text-xs text-slate-400">{formatDate(g.venda.data)} · {g.itens.length} item(ns) em rota</p>
                </div>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 shrink-0">Em rota</span>
            </div>
            {g.venda.observacoes && (
              <div className="mx-3 mb-2 bg-amber-50 border border-amber-200 rounded-md p-2">
                <p className="text-[11px] text-amber-700 font-medium mb-0.5">Observações da negociação</p>
                <p className="text-xs text-amber-800 whitespace-pre-wrap">{g.venda.observacoes}</p>
              </div>
            )}
            {expandedGrupo[`r-${g.venda.id}`] && (
              <div className="border-t border-slate-100 divide-y divide-slate-100">
                {g.itens.map(({ item, chave, saida }) => (
                  <div key={chave} className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">{item.descricao} {item.serial && <span className="text-xs font-mono text-slate-400">· SN {item.serial}</span>}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><CheckCircle2 size={11} className="text-emerald-500" /> Saída confirmada em {formatDate(saida.data)}</p>
                        {saida.fotos && saida.fotos.length > 0 && (
                          <div className="flex gap-1.5 mt-1.5">
                            {saida.fotos.map((f, i) => (
                              <a key={i} href={f} target="_blank" rel="noreferrer">
                                <img src={f} alt="Foto da saída" className="w-12 h-12 object-cover rounded-md border border-slate-200" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <button onClick={() => setFormAtivo({ chave, etapa: 'entrega' })} className="flex items-center gap-1 text-xs bg-slate-900 text-white px-2.5 py-1.5 rounded-md">
                        <Camera size={12} /> Registrar entrega
                      </button>
                    </div>
                    {formAtivo && formAtivo.chave === chave && formAtivo.etapa === 'entrega' && (
                      <ExpedicaoEtapaForm
                        etapa="entrega"
                        vendaId={g.venda.id}
                        item={item}
                        estoque={estoque}
                        expedicoes={expedicoes}
                        setExpedicoes={setExpedicoes}
                        notify={notify}
                        serialEtapaAnterior={saida.serialConfirmado}
                        onDone={() => setFormAtivo(null)}
                        onCancel={() => setFormAtivo(null)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <h3 className="text-sm font-medium text-slate-500 mb-2">Entregas concluídas</h3>
      <div className="space-y-2">
        {gruposConcluidos.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhuma entrega concluída ainda.</p>}
        {gruposConcluidos.map(g => (
          <div key={g.venda.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpandedGrupo(x => ({ ...x, [`c-${g.venda.id}`]: !x[`c-${g.venda.id}`] }))}>
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expandedGrupo[`c-${g.venda.id}`] ? 'rotate-90' : ''}`} />
                <p className="font-medium text-sm truncate flex items-center gap-1.5">{g.venda.clienteNome} {g.venda.observacoes && <ClipboardList size={12} className="text-amber-500 shrink-0" />}</p>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 shrink-0">Entregue</span>
            </div>
            {expandedGrupo[`c-${g.venda.id}`] && (
              <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 space-y-4">
                {g.venda.observacoes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-2">
                    <p className="text-[11px] text-amber-700 font-medium mb-0.5">Observações da negociação</p>
                    <p className="text-xs text-amber-800 whitespace-pre-wrap">{g.venda.observacoes}</p>
                  </div>
                )}
                {g.itens.map(({ item, chave, saida, entrega }) => (
                  <div key={chave} className="text-xs">
                    <p className="text-slate-600 font-medium">{item.descricao} {item.serial && <span className="font-mono text-slate-400 font-normal">· SN {item.serial}</span>}</p>
                    <div className="grid grid-cols-2 gap-2 mt-1.5">
                      <div className="border-l-2 border-slate-200 pl-2">
                        <p className="text-slate-500 font-medium flex items-center gap-1"><TruckIcon size={11} /> Saída da empresa</p>
                        {item.serial && (
                          <p className={`flex items-center gap-1 mt-0.5 ${saida.serialConfirmado === item.serial ? 'text-emerald-600' : 'text-red-500'}`}>
                            {saida.serialConfirmado === item.serial ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />} SN {saida.serialConfirmado || '—'}
                          </p>
                        )}
                        <p className="text-slate-400">{formatDate(saida.data)}</p>
                        {saida.fotos.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {saida.fotos.map((f, i) => (
                              <a key={i} href={f} target="_blank" rel="noreferrer">
                                <img src={f} alt="Foto da saída" className="w-12 h-12 object-cover rounded border border-slate-200" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="border-l-2 border-emerald-200 pl-2">
                        <p className="text-slate-500 font-medium flex items-center gap-1"><PackageCheck size={11} /> Entrega ao cliente</p>
                        {item.serial && (
                          <p className={`flex items-center gap-1 mt-0.5 ${entrega.serialConfirmado === item.serial ? 'text-emerald-600' : 'text-red-500'}`}>
                            {entrega.serialConfirmado === item.serial ? <ShieldCheck size={11} /> : <ShieldAlert size={11} />} SN {entrega.serialConfirmado || '—'}
                          </p>
                        )}
                        <p className="text-slate-400">{formatDate(entrega.data)}</p>
                        {entrega.fotos.length > 0 && (
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {entrega.fotos.map((f, i) => (
                              <a key={i} href={f} target="_blank" rel="noreferrer">
                                <img src={f} alt="Foto da entrega" className="w-12 h-12 object-cover rounded border border-slate-200" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpedicaoEtapaForm({ etapa, vendaId, item, estoque, expedicoes, setExpedicoes, notify, serialEtapaAnterior, onDone, onCancel }) {
  const [serialConfirmado, setSerialConfirmado] = useState(item.serial || '');
  const [fotos, setFotos] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const produto = estoque.find(p => p.id === item.itemId);
  const opcoesSerial = produto && produto.serializado ? (produto.unidades || []).map(u => u.serial) : [];
  const datalistId = `series-${etapa}-${item.itemId}`;
  const rotulo = etapa === 'saida' ? 'saída da empresa' : 'entrega ao cliente';

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []).slice(0, 4 - fotos.length);
    if (files.length === 0) return;
    const novas = await Promise.all(files.map(f => fileToCompressedDataUrl(f)));
    setFotos(f => [...f, ...novas]);
    e.target.value = '';
  }
  function removeFoto(idx) { setFotos(f => f.filter((_, i) => i !== idx)); }

  async function confirmar() {
    if (fotos.length === 0) { notify(`Anexe pelo menos uma foto da ${rotulo}`); return; }
    if (item.serial && !serialConfirmado) { notify('Confirme o número de série do inversor'); return; }
    setEnviando(true);
    const registro = {
      id: uid(), etapa, chave: chaveItemVenda(vendaId, item), vendaId, descricao: item.descricao,
      serialEsperado: item.serial || null, serialConfirmado: item.serial ? serialConfirmado : null,
      fotos, data: new Date().toISOString(),
    };
    await setExpedicoes([registro, ...expedicoes]);
    setEnviando(false);
    notify(etapa === 'saida' ? 'Saída registrada' : 'Entrega registrada');
    onDone();
  }

  const serialDivergenteDaVenda = item.serial && serialConfirmado && serialConfirmado !== item.serial;
  const serialDivergenteDaSaida = etapa === 'entrega' && item.serial && serialConfirmado && serialEtapaAnterior && serialConfirmado !== serialEtapaAnterior;

  return (
    <div className="mt-3 bg-slate-50 border border-slate-200 rounded-md p-3 space-y-3">
      {etapa === 'entrega' && item.serial && (
        <p className="text-xs text-slate-500">Série confirmada na saída da empresa: <span className="font-mono">{serialEtapaAnterior || '—'}</span> — confira novamente no ato da entrega.</p>
      )}
      {item.serial && (
        <div>
          <label className="text-xs text-slate-500">Confirme o número de série do inversor (autocompletar)</label>
          <input
            list={datalistId}
            value={serialConfirmado}
            onChange={e => setSerialConfirmado(e.target.value)}
            placeholder="Digite ou selecione o nº de série..."
            className={`w-full border rounded-md px-2 py-2 text-sm font-mono mt-1 ${serialDivergenteDaVenda || serialDivergenteDaSaida ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}
          />
          <datalist id={datalistId}>
            {opcoesSerial.map(s => <option key={s} value={s} />)}
          </datalist>
          {serialDivergenteDaVenda ? (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><ShieldAlert size={12} /> Divergente do número vendido (SN {item.serial}) — confira antes de confirmar.</p>
          ) : serialDivergenteDaSaida ? (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1"><ShieldAlert size={12} /> Divergente do número confirmado na saída (SN {serialEtapaAnterior}) — confira antes de confirmar.</p>
          ) : (
            <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1"><ShieldCheck size={12} /> Número confere.</p>
          )}
        </div>
      )}

      <div>
        <label className="text-xs text-slate-500 flex items-center gap-1"><Camera size={12} /> Fotos da {rotulo} (etiqueta de série, produto, canhoto etc.)</label>
        <input type="file" accept="image/*" capture="environment" multiple onChange={handleFiles} disabled={fotos.length >= 4} className="text-xs mt-1" />
        {fotos.length > 0 && (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {fotos.map((f, i) => (
              <div key={i} className="relative">
                <img src={f} alt="Prévia" className="w-16 h-16 object-cover rounded-md border border-slate-200" />
                <button onClick={() => removeFoto(i)} className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white rounded-full w-4 h-4 flex items-center justify-center"><X size={10} /></button>
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] text-slate-400 mt-1">Máximo 4 fotos. As fotos ficam visíveis para toda a equipe.</p>
      </div>

      <div className="flex gap-2">
        <button onClick={confirmar} disabled={enviando} className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs px-3 py-2 rounded-md disabled:opacity-50">
          <CheckCircle2 size={13} /> Confirmar {rotulo}
        </button>
        <button onClick={onCancel} className="text-xs text-slate-500 px-3 py-2">Cancelar</button>
      </div>
    </div>
  );
}

/* ---------------- FINANCEIRO (custo, margem, reposição) ---------------- */

/* ---------------- PAGAMENTOS (despesas fora do estoque, pagas com a margem de contribuição) ---------------- */

/* ---------------- BALANÇO DE ESTOQUE (contagem física, correção e relatório de divergências) ---------------- */

function custoMedioProduto(produto, depositoId) {
  if (produto.serializado) {
    const unidades = (produto.unidades || []).filter(u => u.status === 'Disponível' && u.depositoId === depositoId);
    if (!unidades.length) return produto.custoReferencia || 0;
    return unidades.reduce((a, u) => a + (u.custoCompra || 0), 0) / unidades.length;
  }
  const lotes = (produto.lotes || []).filter(l => l.depositoId === depositoId && l.quantidadeDisponivel > 0);
  const qtd = lotes.reduce((a, l) => a + l.quantidadeDisponivel, 0);
  if (!qtd) return produto.custoReferencia || 0;
  return lotes.reduce((a, l) => a + l.quantidadeDisponivel * l.custoUnitario, 0) / qtd;
}

function BalancoModule({ balancos, setBalancos, estoque, setEstoque, depositos, askSenha, notify }) {
  const [depositoNovoId, setDepositoNovoId] = useState(depositos.length === 1 ? depositos[0].id : '');
  const [produtoSelId, setProdutoSelId] = useState('');
  const [qtdContadaInput, setQtdContadaInput] = useState('');
  const [seriaisEncontrados, setSeriaisEncontrados] = useState({}); // { unidadeId: boolean }
  const [expandedHistorico, setExpandedHistorico] = useState({});

  const balancoAtivo = balancos.find(b => b.status === 'Em andamento');
  const produtoSel = estoque.find(p => p.id === produtoSelId);
  const unidadesDoProduto = produtoSel && produtoSel.serializado && balancoAtivo
    ? (produtoSel.unidades || []).filter(u => u.status === 'Disponível' && u.depositoId === balancoAtivo.depositoId)
    : [];

  function selecionarProduto(id) {
    setProdutoSelId(id);
    const produto = estoque.find(p => p.id === id);
    if (produto && produto.serializado && balancoAtivo) {
      const unidades = (produto.unidades || []).filter(u => u.status === 'Disponível' && u.depositoId === balancoAtivo.depositoId);
      setSeriaisEncontrados(Object.fromEntries(unidades.map(u => [u.id, true])));
    } else {
      setSeriaisEncontrados({});
    }
    setQtdContadaInput('');
  }

  async function iniciarBalanco() {
    if (!depositoNovoId) { notify('Selecione o depósito a contar'); return; }
    const deposito = depositos.find(d => d.id === depositoNovoId);
    const novo = { id: uid(), depositoId: depositoNovoId, depositoNome: deposito?.nome || '', data: new Date().toISOString(), status: 'Em andamento', itens: [] };
    await setBalancos([novo, ...balancos]);
    notify('Balanço iniciado');
  }

  async function cancelarBalanco(balanco) {
    if (!(await askSenha(`Cancelar este balanço em andamento (${balanco.depositoNome})? Nenhuma correção será aplicada.`, { label: 'Cancelar balanço' }))) return;
    await setBalancos(balancos.filter(b => b.id !== balanco.id));
    notify('Balanço cancelado');
  }

  async function adicionarItemContagem() {
    const produto = estoque.find(p => p.id === produtoSelId);
    if (!produto) { notify('Selecione um produto'); return; }
    const qtdSistema = availableQty(produto, balancoAtivo.depositoId);
    const custoUnitarioMedio = custoMedioProduto(produto, balancoAtivo.depositoId);
    let novoItem;

    if (produto.serializado) {
      const naoLocalizados = unidadesDoProduto.filter(u => !seriaisEncontrados[u.id]).map(u => ({ id: u.id, serial: u.serial }));
      const qtdContada = unidadesDoProduto.length - naoLocalizados.length;
      novoItem = { id: uid(), produtoId: produto.id, descricao: descricaoProduto(produto), categoria: produto.categoria, serializado: true, quantidadeSistema: qtdSistema, quantidadeContada: qtdContada, custoUnitarioMedio, seriaisNaoLocalizados: naoLocalizados };
    } else {
      const qtdContada = parseInt(qtdContadaInput);
      if (isNaN(qtdContada) || qtdContada < 0) { notify('Informe a quantidade contada (0 ou mais)'); return; }
      novoItem = { id: uid(), produtoId: produto.id, descricao: descricaoProduto(produto), categoria: produto.categoria, serializado: false, quantidadeSistema: qtdSistema, quantidadeContada: qtdContada, custoUnitarioMedio };
    }

    await setBalancos(balancos.map(b => {
      if (b.id !== balancoAtivo.id) return b;
      const jaExiste = b.itens.some(it => it.produtoId === produto.id);
      const itens = jaExiste ? b.itens.map(it => it.produtoId === produto.id ? novoItem : it) : [...b.itens, novoItem];
      return { ...b, itens };
    }));
    notify(novoItem.quantidadeContada === novoItem.quantidadeSistema ? 'Item conferido — sem divergência' : 'Item registrado com divergência');
    setProdutoSelId(''); setQtdContadaInput(''); setSeriaisEncontrados({});
  }

  async function removerItemContagem(balanco, itemId) {
    await setBalancos(balancos.map(b => b.id === balanco.id ? { ...b, itens: b.itens.filter(it => it.id !== itemId) } : b));
  }

  async function finalizarBalanco(balanco) {
    if (balanco.itens.length === 0) { notify('Adicione ao menos um item contado antes de finalizar'); return; }
    const divergentes = balanco.itens.filter(it => it.quantidadeContada !== it.quantidadeSistema);
    const saldoFinanceiro = divergentes.reduce((acc, it) => acc + (it.quantidadeContada - it.quantidadeSistema) * it.custoUnitarioMedio, 0);
    const ok = await askSenha(
      `Finalizar balanço de ${balanco.depositoNome}? ${divergentes.length} item(ns) com divergência serão corrigidos no estoque. Saldo financeiro: ${currency(saldoFinanceiro)}.`,
      { label: 'Finalizar balanço', destrutivo: false }
    );
    if (!ok) return;

    let novoEstoque = estoque.map(p => ({
      ...p,
      unidades: p.unidades ? p.unidades.map(u => ({ ...u })) : p.unidades,
      lotes: p.lotes ? p.lotes.map(l => ({ ...l })) : p.lotes,
    }));
    const avisos = [];

    for (const it of divergentes) {
      const idx = novoEstoque.findIndex(p => p.id === it.produtoId);
      if (idx === -1) continue;
      const diff = it.quantidadeContada - it.quantidadeSistema;

      if (it.serializado) {
        if (diff < 0) {
          const idsNaoLocalizados = new Set((it.seriaisNaoLocalizados || []).map(s => s.id));
          novoEstoque[idx].unidades = novoEstoque[idx].unidades.map(u => idsNaoLocalizados.has(u.id) ? { ...u, status: 'Extraviado' } : u);
        } else if (diff > 0) {
          avisos.push(`${it.descricao}: sobra de ${diff} unidade(s) não foi corrigida automaticamente (item com série exige lançamento via Recebimento, com o número de série de cada unidade).`);
        }
      } else {
        if (diff > 0) {
          novoEstoque[idx].lotes = [...(novoEstoque[idx].lotes || []), {
            id: uid(), quantidade: diff, quantidadeDisponivel: diff, custoUnitario: it.custoUnitarioMedio || 0,
            notaFiscal: 'AJUSTE DE BALANÇO', fornecedor: '', dataEntrada: new Date().toISOString(), depositoId: balanco.depositoId,
          }];
        } else if (diff < 0) {
          let restante = -diff;
          const lotesOrdenados = novoEstoque[idx].lotes.filter(l => l.depositoId === balanco.depositoId).sort((a, b) => new Date(a.dataEntrada) - new Date(b.dataEntrada));
          for (const lote of lotesOrdenados) {
            if (restante <= 0) break;
            const consumo = Math.min(lote.quantidadeDisponivel, restante);
            lote.quantidadeDisponivel -= consumo;
            restante -= consumo;
          }
          novoEstoque[idx].lotes = novoEstoque[idx].lotes.map(l => lotesOrdenados.find(lo => lo.id === l.id) || l);
        }
      }
    }

    await setEstoque(novoEstoque);
    await setBalancos(balancos.map(b => b.id === balanco.id ? { ...b, status: 'Concluído', concluidoEm: new Date().toISOString(), saldoFinanceiro } : b));
    notify('Balanço finalizado e estoque corrigido');
    avisos.forEach(a => notify(a));
  }

  function gerarRelatorioBalanco(balanco, formato) {
    const divergentes = balanco.itens.filter(it => it.quantidadeContada !== it.quantidadeSistema);
    const saldoFinanceiro = balanco.saldoFinanceiro !== undefined ? balanco.saldoFinanceiro : divergentes.reduce((acc, it) => acc + (it.quantidadeContada - it.quantidadeSistema) * it.custoUnitarioMedio, 0);
    baixarDocumento({
      titulo: 'RELATÓRIO DE BALANÇO DE ESTOQUE',
      numeroLabel: 'Balanço Nº',
      numero: balanco.id.slice(-6).toUpperCase(),
      data: formatDate(balanco.concluidoEm || balanco.data),
      cliente: { nome: balanco.depositoNome },
      clienteLabel: 'Depósito',
      itens: divergentes.map(it => ({
        descricao: it.seriaisNaoLocalizados && it.seriaisNaoLocalizados.length > 0
          ? `${it.descricao} — sistema ${it.quantidadeSistema} → contado ${it.quantidadeContada} (SN não localizadas: ${it.seriaisNaoLocalizados.map(s => s.serial).join(', ')})`
          : `${it.descricao} — sistema ${it.quantidadeSistema} → contado ${it.quantidadeContada}`,
        quantidade: it.quantidadeContada - it.quantidadeSistema,
        precoUnitario: it.custoUnitarioMedio,
        subtotal: (it.quantidadeContada - it.quantidadeSistema) * it.custoUnitarioMedio,
      })),
      totalLabel: 'Saldo financeiro do balanço',
      totalValor: saldoFinanceiro,
      observacoes: `${balanco.itens.length} item(ns) conferido(s) · ${divergentes.length} com divergência.`,
    }, `balanco-${(balanco.depositoNome || 'deposito').replace(/\s+/g, '-').toLowerCase()}`, formato);
  }

  const balancosConcluidos = balancos.filter(b => b.status === 'Concluído');

  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">Digite a quantidade contada fisicamente de cada item que quiser conferir — o sistema mostra o que está registrado e, ao finalizar, corrige as divergências automaticamente.</p>

      {!balancoAtivo ? (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-5 space-y-2">
          <h3 className="text-sm font-medium">Iniciar novo balanço</h3>
          <div className="flex flex-col sm:flex-row gap-2">
            <select value={depositoNovoId} onChange={e => setDepositoNovoId(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm flex-1">
              <option value="">Selecione o depósito a contar...</option>
              {depositos.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
            </select>
            <button onClick={iniciarBalanco} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-4 py-2 rounded-md">Iniciar balanço</button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-amber-200 rounded-lg p-4 mb-5 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium flex items-center gap-1.5"><Scale size={14} className="text-amber-600" /> Balanço em andamento — {balancoAtivo.depositoNome}</h3>
            <button onClick={() => cancelarBalanco(balancoAtivo)} className="text-xs text-slate-400 hover:text-red-500">Cancelar balanço</button>
          </div>

          <div className="border border-dashed border-slate-200 rounded-md p-3 space-y-2">
            <select value={produtoSelId} onChange={e => selecionarProduto(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm">
              <option value="">Selecione o produto a conferir...</option>
              {estoque.map(p => <option key={p.id} value={p.id}>{p.categoria} · {descricaoProduto(p)} (sistema: {availableQty(p, balancoAtivo.depositoId)})</option>)}
            </select>

            {produtoSel && produtoSel.serializado ? (
              <div>
                <p className="text-xs text-slate-500 mb-1.5">Desmarque os números de série que <strong>não</strong> foram localizados fisicamente:</p>
                {unidadesDoProduto.length === 0 ? (
                  <p className="text-xs text-slate-400">Nenhuma unidade disponível deste produto nesse depósito.</p>
                ) : (
                  <div className="space-y-1 max-h-48 overflow-y-auto border border-slate-100 rounded-md p-2">
                    {unidadesDoProduto.map(u => (
                      <label key={u.id} className="flex items-center gap-2 text-xs">
                        <input type="checkbox" checked={!!seriaisEncontrados[u.id]} onChange={e => setSeriaisEncontrados(s => ({ ...s, [u.id]: e.target.checked }))} />
                        <span className="font-mono">{u.serial}</span>
                      </label>
                    ))}
                  </div>
                )}
                <button onClick={adicionarItemContagem} disabled={unidadesDoProduto.length === 0} className="mt-2 bg-slate-900 disabled:opacity-30 text-white text-sm px-3 py-2 rounded-md">Registrar contagem</button>
              </div>
            ) : produtoSel ? (
              <div className="flex gap-2">
                <input type="number" min={0} value={qtdContadaInput} onChange={e => setQtdContadaInput(e.target.value)} placeholder="Quantidade contada" className="border border-slate-200 rounded-md px-2 py-2 text-sm flex-1" />
                <button onClick={adicionarItemContagem} className="bg-slate-900 text-white text-sm px-3 py-2 rounded-md">Registrar contagem</button>
              </div>
            ) : null}
          </div>

          {balancoAtivo.itens.length > 0 && (
            <div className="border border-slate-100 rounded-md divide-y">
              {balancoAtivo.itens.map(it => {
                const diff = it.quantidadeContada - it.quantidadeSistema;
                return (
                  <div key={it.id} className="flex justify-between items-center px-3 py-2 text-sm">
                    <div>
                      <p>{it.descricao}</p>
                      <p className="text-xs text-slate-400">Sistema: {it.quantidadeSistema} · Contado: {it.quantidadeContada}</p>
                      {it.seriaisNaoLocalizados && it.seriaisNaoLocalizados.length > 0 && (
                        <p className="text-xs text-red-500 font-mono">Não localizadas: {it.seriaisNaoLocalizados.map(s => s.serial).join(', ')}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${diff === 0 ? 'text-emerald-600' : diff > 0 ? 'text-blue-600' : 'text-red-500'}`}>
                        {diff === 0 ? 'OK' : diff > 0 ? `+${diff}` : diff}
                      </span>
                      <button onClick={() => removerItemContagem(balancoAtivo, it.id)}><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button onClick={() => finalizarBalanco(balancoAtivo)} disabled={balancoAtivo.itens.length === 0} className="w-full bg-emerald-500 disabled:opacity-30 hover:bg-emerald-600 text-white font-medium text-sm px-4 py-2 rounded-md">
            Finalizar balanço e corrigir estoque
          </button>
        </div>
      )}

      <h3 className="text-sm font-medium text-slate-500 mb-2">Balanços concluídos</h3>
      <div className="space-y-2">
        {balancosConcluidos.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum balanço concluído ainda.</p>}
        {balancosConcluidos.map(b => {
          const divergentes = b.itens.filter(it => it.quantidadeContada !== it.quantidadeSistema);
          const saldo = b.saldoFinanceiro !== undefined ? b.saldoFinanceiro : divergentes.reduce((acc, it) => acc + (it.quantidadeContada - it.quantidadeSistema) * it.custoUnitarioMedio, 0);
          return (
            <div key={b.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpandedHistorico(x => ({ ...x, [b.id]: !x[b.id] }))}>
                <div className="flex items-center gap-2 min-w-0">
                  <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expandedHistorico[b.id] ? 'rotate-90' : ''}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{b.depositoNome}</p>
                    <p className="text-xs text-slate-400">{formatDate(b.concluidoEm || b.data)} · {b.itens.length} item(ns) · {divergentes.length} divergência(s)</p>
                  </div>
                </div>
                <span className={`font-medium text-sm shrink-0 ${saldo < 0 ? 'text-red-500' : saldo > 0 ? 'text-blue-600' : 'text-emerald-600'}`}>{currency(saldo)}</span>
              </div>
              {expandedHistorico[b.id] && (
                <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 space-y-2">
                  <div className="space-y-1">
                    {b.itens.map(it => {
                      const diff = it.quantidadeContada - it.quantidadeSistema;
                      return (
                        <div key={it.id} className="text-xs text-slate-600">
                          <p>
                            {it.descricao} — sistema {it.quantidadeSistema} → contado {it.quantidadeContada}
                            {diff !== 0 && <span className={diff > 0 ? 'text-blue-600' : 'text-red-500'}> ({diff > 0 ? '+' : ''}{diff})</span>}
                          </p>
                          {it.seriaisNaoLocalizados && it.seriaisNaoLocalizados.length > 0 && (
                            <p className="text-red-500 font-mono">Não localizadas: {it.seriaisNaoLocalizados.map(s => s.serial).join(', ')}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => gerarRelatorioBalanco(b, 'jpg')} className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-md"><FileText size={12} /> Relatório JPG</button>
                    <button onClick={() => gerarRelatorioBalanco(b, 'pdf')} className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-md"><FileText size={12} /> Relatório PDF</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PagamentosModule({ pagamentos, setPagamentos, vendas, askSenha, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [tipo, setTipo] = useState('Saída');
  const [data, setData] = useState(new Date().toISOString().slice(0, 10));
  const [categoria, setCategoria] = useState(PAGAMENTO_CATEGORIAS_SAIDA[0]);
  const [descricao, setDescricao] = useState('');
  const [beneficiario, setBeneficiario] = useState('');
  const [valor, setValor] = useState('');
  const [comprovante, setComprovante] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [ordenacao, setOrdenacao] = useState('recente');

  const categoriasDoTipo = tipo === 'Entrada' ? PAGAMENTO_CATEGORIAS_ENTRADA : PAGAMENTO_CATEGORIAS_SAIDA;

  function mudarTipo(novoTipo) {
    setTipo(novoTipo);
    setCategoria((novoTipo === 'Entrada' ? PAGAMENTO_CATEGORIAS_ENTRADA : PAGAMENTO_CATEGORIAS_SAIDA)[0]);
  }

  function resetForm() {
    setTipo('Saída'); setCategoria(PAGAMENTO_CATEGORIAS_SAIDA[0]); setData(new Date().toISOString().slice(0, 10));
    setDescricao(''); setBeneficiario(''); setValor(''); setComprovante(null); setShowForm(false);
  }

  async function handleComprovante(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const dataUrl = isImage ? await fileToCompressedDataUrl(file) : await fileToDataUrl(file);
    setComprovante({ nome: file.name, tipo: file.type, dataUrl });
  }

  async function salvar() {
    const v = parseValorBR(valor);
    if (!descricao.trim()) { notify('Descreva o lançamento'); return; }
    if (isNaN(v) || v <= 0) { notify('Informe um valor válido'); return; }
    setEnviando(true);
    const novo = {
      id: uid(), tipo, data: new Date(data + 'T12:00:00').toISOString(), categoria, descricao: descricao.trim(),
      beneficiario: beneficiario.trim(), valor: v, comprovante, criadoEm: new Date().toISOString(),
    };
    await setPagamentos([novo, ...pagamentos]);
    setEnviando(false);
    notify(tipo === 'Entrada' ? 'Entrada registrada' : 'Pagamento registrado');
    resetForm();
  }

  async function apagarPagamento(p) {
    if (p.anulado) return;
    const ok = await askSenha(`Apagar o lançamento "${p.descricao}" (${p.tipo === 'Entrada' ? '+' : '-'}${currency(p.valor)})? Ele ficará marcado como anulado no histórico.`);
    if (!ok) return;
    await setPagamentos(pagamentos.map(x => x.id === p.id ? { ...x, anulado: true, anuladoEm: new Date().toISOString() } : x));
    notify('Lançamento anulado');
  }

  const pagamentosFiltrados = useMemo(() => {
    let lista = pagamentos.filter(p => `${p.descricao} ${p.beneficiario}`.toLowerCase().includes(busca.toLowerCase()));
    if (filtroTipo !== 'Todos') lista = lista.filter(p => p.tipo === filtroTipo);
    return lista.slice().sort((a, b) => {
      switch (ordenacao) {
        case 'recente': return new Date(b.data) - new Date(a.data);
        case 'antigo': return new Date(a.data) - new Date(b.data);
        case 'valorDesc': return b.valor - a.valor;
        case 'valorAsc': return a.valor - b.valor;
        default: return 0;
      }
    });
  }, [pagamentos, busca, filtroTipo, ordenacao]);

  // Margem de contribuição do mês (das vendas) + entradas extras - saídas, tudo dentro do mês atual
  const resumoMes = useMemo(() => {
    const inicioMes = new Date(); inicioMes.setDate(1); inicioMes.setHours(0, 0, 0, 0);
    const vendasMes = vendas.filter(v => !v.anulado && new Date(v.data) >= inicioMes);
    const margemContribuicao = vendasMes.reduce((acc, v) => acc + (v.totalVenda - v.totalCusto), 0);
    const pagamentosMes = pagamentos.filter(p => !p.anulado && new Date(p.data) >= inicioMes);
    const entradasExtras = pagamentosMes.filter(p => p.tipo === 'Entrada').reduce((acc, p) => acc + p.valor, 0);
    const saidas = pagamentosMes.filter(p => p.tipo === 'Saída').reduce((acc, p) => acc + p.valor, 0);
    return { margemContribuicao, entradasExtras, saidas, saldo: margemContribuicao + entradasExtras - saidas };
  }, [vendas, pagamentos]);

  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">Lançamentos de caixa que não são compra de material pro estoque — tanto saídas (despesas) quanto entradas extras. Usam a margem de contribuição, não o saldo de reposição.</p>

      <div className={`rounded-lg p-4 mb-5 border ${resumoMes.saldo < 0 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
        <p className={`text-xs ${resumoMes.saldo < 0 ? 'text-red-700' : 'text-emerald-700'}`}>Saldo disponível do mês (margem de contribuição + entradas extras - saídas)</p>
        <p className={`text-2xl font-semibold ${resumoMes.saldo < 0 ? 'text-red-700' : 'text-emerald-700'}`}>{currency(resumoMes.saldo)}</p>
        <div className="flex gap-4 mt-2 text-xs text-slate-500 flex-wrap">
          <span>Margem do mês: {currency(resumoMes.margemContribuicao)}</span>
          <span>Entradas extras: {currency(resumoMes.entradasExtras)}</span>
          <span>Saídas: {currency(resumoMes.saidas)}</span>
        </div>
        {resumoMes.saldo < 0 && <p className="text-[11px] text-red-600 mt-1">As saídas deste mês já ultrapassaram o que entrou até agora.</p>}
      </div>

      <div className="flex justify-end mb-3">
        <button onClick={() => setShowForm(s => !s)} className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
          <Plus size={16} /> Novo lançamento
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">Novo lançamento</h3>
            <button onClick={resetForm}><X size={16} className="text-slate-400" /></button>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => mudarTipo('Saída')} className={`flex-1 text-sm px-3 py-2 rounded-md border ${tipo === 'Saída' ? 'bg-red-500 text-white border-red-500' : 'border-slate-200 text-slate-500'}`}>Saída (pagamento)</button>
            <button type="button" onClick={() => mudarTipo('Entrada')} className={`flex-1 text-sm px-3 py-2 rounded-md border ${tipo === 'Entrada' ? 'bg-emerald-500 text-white border-emerald-500' : 'border-slate-200 text-slate-500'}`}>Entrada</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm">
              {categoriasDoTipo.map(c => <option key={c}>{c}</option>)}
            </select>
            <input type="date" value={data} onChange={e => setData(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input placeholder={tipo === 'Entrada' ? 'Descrição (ex: Aporte de capital)' : 'Descrição (ex: Aluguel do galpão - Agosto)'} value={descricao} onChange={e => setDescricao(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm sm:col-span-2" />
            <input placeholder={tipo === 'Entrada' ? 'De quem veio' : 'Beneficiário / para quem foi pago'} value={beneficiario} onChange={e => setBeneficiario(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input type="text" inputMode="decimal" placeholder="Valor (R$) ex: 1500,00" value={valor} onChange={e => setValor(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
          </div>
          <div>
            <label className="inline-flex items-center gap-1.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-md cursor-pointer">
              <Camera size={12} /> {comprovante ? 'Trocar comprovante' : 'Anexar comprovante (opcional)'}
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={handleComprovante} />
            </label>
            {comprovante && <span className="text-xs text-slate-500 ml-2">{comprovante.nome}</span>}
          </div>
          <button onClick={salvar} disabled={enviando} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800 disabled:opacity-50">Salvar lançamento</button>
        </div>
      )}

      <FiltroBar
        busca={busca} setBusca={setBusca} buscaPlaceholder="Buscar por descrição ou beneficiário..."
        filtroValue={filtroTipo} setFiltro={setFiltroTipo}
        filtroOptions={[{ value: 'Todos', label: 'Entradas e saídas' }, { value: 'Saída', label: 'Só saídas' }, { value: 'Entrada', label: 'Só entradas' }]}
        ordenacaoValue={ordenacao} setOrdenacao={setOrdenacao}
        ordenacaoOptions={[{ value: 'recente', label: 'Mais recente primeiro' }, { value: 'antigo', label: 'Mais antigo primeiro' }, { value: 'valorDesc', label: 'Maior valor primeiro' }, { value: 'valorAsc', label: 'Menor valor primeiro' }]}
      />

      <div className="space-y-2">
        {pagamentos.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum lançamento registrado.</p>}
        {pagamentos.length > 0 && pagamentosFiltrados.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum lançamento encontrado com esse filtro.</p>}
        {pagamentosFiltrados.map(p => (
          <div key={p.id} className={`bg-white border rounded-lg p-3 flex justify-between items-start gap-2 ${p.anulado ? 'border-red-200 opacity-60' : 'border-slate-200'}`}>
            <div className="min-w-0">
              <p className="text-sm font-medium flex items-center gap-1.5">
                <span className={`text-[11px] px-1.5 py-0.5 rounded ${p.tipo === 'Entrada' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{p.tipo}</span>
                <span className={p.anulado ? 'line-through' : ''}>{p.descricao}</span>
                {p.anulado && <span className="text-[11px] px-1.5 py-0.5 rounded bg-red-100 text-red-600">Anulado</span>}
              </p>
              <p className="text-xs text-slate-500">{p.categoria} {p.beneficiario && `· ${p.beneficiario}`} · {formatDate(p.data)}</p>
              {p.comprovante && (
                p.comprovante.tipo?.startsWith('image/') ? (
                  <a href={p.comprovante.dataUrl} target="_blank" rel="noreferrer"><img src={p.comprovante.dataUrl} alt="Comprovante" className="w-12 h-12 object-cover rounded border border-slate-200 mt-1.5" /></a>
                ) : (
                  <a href={p.comprovante.dataUrl} download={p.comprovante.nome} className="text-xs text-amber-600 underline mt-1 inline-block">Ver comprovante (PDF)</a>
                )
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`font-medium text-sm ${p.tipo === 'Entrada' ? 'text-emerald-600' : 'text-slate-700'}`}>{p.tipo === 'Entrada' ? '+' : '-'} {currency(p.valor)}</span>
              {!p.anulado && <button onClick={() => apagarPagamento(p)} title="Apagar lançamento"><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceiroModule({ vendas: vendasTodas, estoque, pedidosCompra, recebimentos, pagamentos, ajustesReposicao, setAjustesReposicao, askSenha, notify }) {
  const vendas = useMemo(() => vendasTodas.filter(v => !v.anulado), [vendasTodas]);
  const [periodo, setPeriodo] = useState('mes');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const [showAjuste, setShowAjuste] = useState(false);
  const [valorAjuste, setValorAjuste] = useState('');
  const [motivoAjuste, setMotivoAjuste] = useState('');
  const [enviandoAjuste, setEnviandoAjuste] = useState(false);

  const ajustesValidos = useMemo(() => (ajustesReposicao || []).filter(a => !a.anulado), [ajustesReposicao]);
  const totalAjustes = useMemo(() => ajustesValidos.reduce((acc, a) => acc + a.valor, 0), [ajustesValidos]);

  async function salvarAjuste() {
    const v = parseValorBR(valorAjuste);
    if (isNaN(v) || v === 0) { notify('Informe um valor de ajuste diferente de zero (pode ser negativo)'); return; }
    if (!motivoAjuste.trim()) { notify('Descreva o motivo do ajuste'); return; }
    const ok = await askSenha(`Lançar um ajuste de ${v > 0 ? '+' : ''}${currency(v)} no saldo de reposição? Motivo: "${motivoAjuste.trim()}".`, { label: 'Lançar ajuste', destrutivo: false });
    if (!ok) return;
    setEnviandoAjuste(true);
    const novo = { id: uid(), data: new Date().toISOString(), valor: v, motivo: motivoAjuste.trim() };
    await setAjustesReposicao([novo, ...(ajustesReposicao || [])]);
    setEnviandoAjuste(false);
    notify('Ajuste lançado no saldo de reposição');
    setValorAjuste(''); setMotivoAjuste(''); setShowAjuste(false);
  }

  async function apagarAjuste(a) {
    if (a.anulado) return;
    const ok = await askSenha(`Apagar o ajuste de ${currency(a.valor)} ("${a.motivo}")? Ficará marcado como anulado no histórico.`);
    if (!ok) return;
    await setAjustesReposicao(ajustesReposicao.map(x => x.id === a.id ? { ...x, anulado: true, anuladoEm: new Date().toISOString() } : x));
    notify('Ajuste anulado');
  }

  // Saldo da margem de contribuição: acumulado desde sempre, nunca zera na virada do mês.
  // Cresce com a margem (venda - custo) de cada venda e é abatido pelas saídas de Pagamentos (somando entradas extras).
  const saldoMargemContribuicao = useMemo(() => {
    const margemAcumulada = vendas.reduce((acc, v) => acc + (v.totalVenda - v.totalCusto), 0);
    const pagamentosValidos = (pagamentos || []).filter(p => !p.anulado);
    const entradasAcumuladas = pagamentosValidos.filter(p => p.tipo === 'Entrada').reduce((acc, p) => acc + p.valor, 0);
    const saidasAcumuladas = pagamentosValidos.filter(p => p.tipo === 'Saída').reduce((acc, p) => acc + p.valor, 0);
    return margemAcumulada + entradasAcumuladas - saidasAcumuladas;
  }, [vendas, pagamentos]);

  const vendasFiltradas = useMemo(() => {
    if (periodo === 'tudo') return vendas;
    if (periodo === 'personalizado') {
      if (!dataInicio && !dataFim) return vendas;
      const inicio = dataInicio ? new Date(dataInicio + 'T00:00:00') : null;
      const fim = dataFim ? new Date(dataFim + 'T23:59:59') : null;
      return vendas.filter(v => {
        const d = new Date(v.data);
        return (!inicio || d >= inicio) && (!fim || d <= fim);
      });
    }
    const agora = new Date();
    if (periodo === 'mesPassado') {
      const inicio = new Date(agora.getFullYear(), agora.getMonth() - 1, 1);
      const fim = new Date(agora.getFullYear(), agora.getMonth(), 0, 23, 59, 59);
      return vendas.filter(v => { const d = new Date(v.data); return d >= inicio && d <= fim; });
    }
    const limite = new Date();
    if (periodo === '30dias') limite.setDate(agora.getDate() - 30);
    if (periodo === 'mes') { limite.setDate(1); limite.setHours(0, 0, 0, 0); }
    return vendas.filter(v => new Date(v.data) >= limite);
  }, [vendas, periodo, dataInicio, dataFim]);

  const totais = useMemo(() => {
    const totalVenda = vendasFiltradas.reduce((acc, v) => acc + v.totalVenda, 0);
    const totalCusto = vendasFiltradas.reduce((acc, v) => acc + v.totalCusto, 0);
    return { totalVenda, totalCusto, margemContribuicao: totalVenda - totalCusto };
  }, [vendasFiltradas]);

  // Saldo de reposição: acumulado desde sempre, independente do filtro de período.
  // Cresce com o custo (CMV) de cada venda e é abatido pelo valor de cada pedido de compra realizado.
  const saldoReposicao = useMemo(() => {
    const cmvAcumulado = vendas.reduce((acc, v) => acc + v.totalCusto, 0);
    const pedidosAcumulado = (pedidosCompra || []).filter(p => !p.cancelado && !p.anulado).reduce((acc, p) => acc + p.valorTotal, 0);
    return { cmvAcumulado, pedidosAcumulado, saldo: cmvAcumulado - pedidosAcumulado + totalAjustes };
  }, [vendas, pedidosCompra, totalAjustes]);

  // Balanço da distribuidora: retrato do momento atual (não filtra por período)
  const balanco = useMemo(() => {
    let valorEstoqueDisponivel = 0;
    for (const item of estoque) {
      const custoRef = item.custoReferencia || 0;
      if (item.serializado) {
        valorEstoqueDisponivel += (item.unidades || []).filter(u => u.status === 'Disponível').reduce((acc, u) => acc + (u.custoCompra > 0 ? u.custoCompra : custoRef), 0);
      } else {
        valorEstoqueDisponivel += (item.lotes || []).reduce((acc, l) => acc + l.quantidadeDisponivel * (l.custoUnitario > 0 ? l.custoUnitario : custoRef), 0);
      }
    }

    let valorEstoqueAguardando = 0;
    for (const p of (pedidosCompra || [])) {
      if (p.cancelado || p.anulado) continue;
      for (const it of p.itens) {
        const recebido = qtdRecebida(recebimentos || [], p.id, it.id);
        const pendente = it.quantidade - recebido;
        if (pendente > 0) valorEstoqueAguardando += pendente * it.custoUnitario;
      }
    }

    const valoresAReceber = vendas
      .filter(v => !(v.comprovantes && v.comprovantes.length > 0))
      .reduce((acc, v) => acc + v.totalVenda, 0);

    return { valorEstoqueDisponivel, valorEstoqueAguardando, valoresAReceber };
  }, [estoque, pedidosCompra, recebimentos, vendas]);

  const totalImobilizado = balanco.valorEstoqueDisponivel + balanco.valorEstoqueAguardando + saldoReposicao.saldo + balanco.valoresAReceber;

  const custoPorCategoria = useMemo(() => {
    const map = {};
    for (const v of vendasFiltradas) {
      for (const it of v.itens) {
        map[it.categoria] = (map[it.categoria] || 0) + it.custoTotal;
      }
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [vendasFiltradas]);

  return (
    <div>
      <div className={`rounded-lg p-4 mb-5 border ${saldoReposicao.saldo < 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
        <p className={`text-xs ${saldoReposicao.saldo < 0 ? 'text-amber-700' : 'text-emerald-700'}`}>Saldo de reposição a manter em caixa (acumulado: custo de todas as vendas, menos todos os pedidos de compra, mais ajustes)</p>
        <p className={`text-2xl font-semibold ${saldoReposicao.saldo < 0 ? 'text-amber-700' : 'text-emerald-700'}`}>{currency(saldoReposicao.saldo)}</p>
        <div className="flex gap-4 mt-2 text-xs text-slate-500 flex-wrap">
          <span>CMV acumulado: {currency(saldoReposicao.cmvAcumulado)}</span>
          <span>Pedidos de compra: {currency(saldoReposicao.pedidosAcumulado)}</span>
          <span>Ajustes: {currency(totalAjustes)}</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">{saldoReposicao.saldo < 0 ? 'Os pedidos de compra já ultrapassaram o custo do que foi vendido — esse valor negativo indica que foi gasto mais do que a reposição gerada até agora.' : 'Esse valor deve ficar reservado no banco para repor o que já foi vendido.'}</p>

        <div className="mt-3 pt-3 border-t border-amber-200">
          <button onClick={() => setShowAjuste(s => !s)} className="text-xs bg-white border border-amber-300 hover:bg-amber-100 text-amber-700 px-2.5 py-1.5 rounded-md">
            {showAjuste ? 'Cancelar ajuste' : '+ Ajustar saldo de reposição'}
          </button>
          {showAjuste && (
            <div className="mt-2 bg-white border border-amber-200 rounded-md p-3 space-y-2">
              <input type="text" inputMode="decimal" placeholder="Valor do ajuste (positivo ou negativo) ex: -500,00" value={valorAjuste} onChange={e => setValorAjuste(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
              <input placeholder="Motivo do ajuste" value={motivoAjuste} onChange={e => setMotivoAjuste(e.target.value)} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
              <button onClick={salvarAjuste} disabled={enviandoAjuste} className="bg-slate-900 text-white text-xs px-3 py-2 rounded-md disabled:opacity-50">Lançar ajuste</button>
            </div>
          )}
          {ajustesValidos.length > 0 && (
            <div className="mt-3 space-y-1.5">
              <p className="text-xs text-amber-700 font-medium">Histórico de ajustes</p>
              {ajustesReposicao.map(a => (
                <div key={a.id} className={`flex justify-between items-center text-xs ${a.anulado ? 'opacity-50' : ''}`}>
                  <span className={a.anulado ? 'line-through text-slate-400' : 'text-slate-600'}>
                    {a.motivo} · {formatDate(a.data)} {a.anulado && <span className="text-red-500">(anulado)</span>}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className={a.valor >= 0 ? 'text-emerald-600' : 'text-red-500'}>{a.valor >= 0 ? '+' : ''}{currency(a.valor)}</span>
                    {!a.anulado && <button onClick={() => apagarAjuste(a)} title="Apagar lançamento"><Trash2 size={12} className="text-slate-300 hover:text-red-500" /></button>}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-5">
        <h3 className="text-sm font-medium mb-1">Balanço da distribuidora</h3>
        <p className="text-[11px] text-slate-400 mb-3">Retrato do momento atual (não muda com o filtro de período abaixo)</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Valor do estoque disponível <span className="text-slate-400">(a custo)</span></span>
            <span className="font-medium">{currency(balanco.valorEstoqueDisponivel)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Valor do estoque aguardando chegada <span className="text-slate-400">(pedidos não recebidos)</span></span>
            <span className="font-medium">{currency(balanco.valorEstoqueAguardando)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Saldo de reposição</span>
            <span className="font-medium">{currency(saldoReposicao.saldo)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">Valores a receber <span className="text-slate-400">(sem comprovante de pagamento)</span></span>
            <span className="font-medium">{currency(balanco.valoresAReceber)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
            <span className="text-slate-800 font-medium">Total imobilizado</span>
            <span className="font-semibold text-base">{currency(totalImobilizado)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-2 flex-wrap">
        {[['mes', 'Este mês'], ['mesPassado', 'Mês passado'], ['30dias', 'Últimos 30 dias'], ['tudo', 'Tudo'], ['personalizado', 'Período personalizado']].map(([v, l]) => (
          <button key={v} onClick={() => setPeriodo(v)} className={`text-xs px-3 py-1.5 rounded-full border ${periodo === v ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500'}`}>{l}</button>
        ))}
      </div>
      {periodo === 'personalizado' && (
        <div className="flex flex-wrap items-center gap-2 mb-4 bg-white border border-slate-200 rounded-lg p-3">
          <label className="text-xs text-slate-500">De</label>
          <input type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="border border-slate-200 rounded-md px-2 py-1.5 text-sm" />
          <label className="text-xs text-slate-500">Até</label>
          <input type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="border border-slate-200 rounded-md px-2 py-1.5 text-sm" />
          {(dataInicio || dataFim) && (
            <button onClick={() => { setDataInicio(''); setDataFim(''); }} className="text-xs text-slate-400 hover:text-slate-600">Limpar</button>
          )}
        </div>
      )}
      <div className="mb-2" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500">Total vendido no período</p>
          <p className="text-xl font-semibold">{currency(totais.totalVenda)}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-xs text-emerald-700">Margem de contribuição (zera todo mês)</p>
          <p className="text-xl font-semibold text-emerald-700">{currency(totais.margemContribuicao)}</p>
          <div className="border-t border-emerald-200 mt-2 pt-2">
            <p className="text-xs text-emerald-700">Saldo da margem de contribuição</p>
            <p className={`text-lg font-semibold ${saldoMargemContribuicao < 0 ? 'text-red-600' : 'text-emerald-700'}`}>{currency(saldoMargemContribuicao)}</p>
            <p className="text-[11px] text-emerald-600">Acumulado desde sempre — cresce com cada venda e reduz com cada pagamento. Não zera na virada do mês.</p>
          </div>
        </div>
      </div>

      {custoPorCategoria.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-5">
          <h3 className="text-sm font-medium mb-2">Custo por categoria no período</h3>
          <div className="space-y-1.5">
            {custoPorCategoria.map(([cat, val]) => (
              <div key={cat} className="flex justify-between text-sm">
                <span className="text-slate-600">{cat}</span>
                <span className="font-medium">{currency(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-sm font-medium text-slate-500 mb-2">Detalhamento por venda (custo x venda)</h3>
      <div className="space-y-2">
        {vendasFiltradas.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhuma venda no período.</p>}
        {vendasFiltradas.map(v => (
          <div key={v.id} className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-center text-sm">
            <div>
              <p className="font-medium">{v.clienteNome}</p>
              <p className="text-xs text-slate-400">{formatDate(v.data)}</p>
            </div>
            <div className="text-right">
              <p>Venda: <span className="font-medium">{currency(v.totalVenda)}</span></p>
              <p className="text-xs text-amber-600">Custo: {currency(v.totalCusto)}</p>
            </div>
          </div>
        ))}
      </div>

      {(pedidosCompra || []).length > 0 && (
        <>
          <h3 className="text-sm font-medium text-slate-500 mb-2 mt-5">Pedidos de compra (abatem o saldo de reposição)</h3>
          <div className="space-y-2">
            {pedidosCompra.filter(p => !p.cancelado && !p.anulado).map(p => (
              <div key={p.id} className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">{p.fornecedorNome}</p>
                  <p className="text-xs text-slate-400">Pedido {p.numeroPedidoFornecedor} · {formatDate(p.data)}</p>
                </div>
                <span className="font-medium text-amber-600">- {currency(p.valorTotal)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------- AUTENTICAÇÃO (login da equipe via Supabase) ---------------- */

export default function App() {
  const [session, setSession] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-slate-400" size={24} />
      </div>
    );
  }

  if (!session) return <LoginScreen />;

  return <AppInner />;
}
