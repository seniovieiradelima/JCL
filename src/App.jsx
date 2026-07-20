import React, { useState, useEffect, useMemo } from 'react';
import { Package, Users, ShoppingCart, Plus, Search, X, Trash2, AlertTriangle, ChevronRight, Loader2, CheckCircle2, TruckIcon, LineChart, FileText, ClipboardList, ArrowRightCircle, Ban, Pencil, PackageCheck, Camera, ShieldCheck, ShieldAlert, Building2, ClipboardCheck, Warehouse, ArrowLeftRight, Database, ShoppingBag, HandCoins, DownloadCloud, UploadCloud, LogOut } from 'lucide-react';
import { loadKey, saveKey } from './lib/storage';
import { supabase } from './lib/supabaseClient';
import LoginScreen from './LoginScreen';

const CATEGORIAS = ['Inversor', 'Painel', 'Estrutura', 'Cabo', 'Outro'];
const SERIALIZAVEL_PADRAO = { Inversor: true, Painel: false, Estrutura: false, Cabo: false, Outro: false };
const CADASTRO_TABS = ['estoque', 'depositos', 'fornecedores', 'clientes'];
const COMPRAS_TABS = ['transferencias', 'pedidos', 'recebimento', 'financeiro'];
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
function formatDate(iso) {
  return new Date(iso).toLocaleDateString('pt-BR');
}

function availableQty(item, depositoId) {
  if (!item) return 0;
  if (item.serializado) return (item.unidades || []).filter(u => u.status === 'Disponível' && (!depositoId || u.depositoId === depositoId)).length;
  return (item.lotes || []).filter(l => !depositoId || l.depositoId === depositoId).reduce((acc, l) => acc + l.quantidadeDisponivel, 0);
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

    if (it.unidadeId) {
      const uIdx = novoEstoque[idx].unidades.findIndex(u => u.id === it.unidadeId);
      if (uIdx === -1 || novoEstoque[idx].unidades[uIdx].status !== 'Disponível') {
        erros.push(`${it.descricao} (SN ${it.serial}): unidade não está mais disponível`);
        continue;
      }
      custoTotal = novoEstoque[idx].unidades[uIdx].custoCompra;
      novoEstoque[idx].unidades[uIdx].status = 'Vendido';
    } else {
      const lotesDoDeposito = novoEstoque[idx].lotes.filter(l => l.depositoId === it.depositoId);
      const disponivel = lotesDoDeposito.reduce((acc, l) => acc + l.quantidadeDisponivel, 0);
      if (disponivel < it.quantidade) {
        erros.push(`${it.descricao}: apenas ${disponivel} disponível(is) em ${it.depositoNome || 'depósito selecionado'}, pedido ${it.quantidade}`);
        continue;
      }
      let restante = it.quantidade;
      const lotesOrdenados = lotesDoDeposito.slice().sort((a, b) => new Date(a.dataEntrada) - new Date(b.dataEntrada));
      for (const lote of lotesOrdenados) {
        if (restante <= 0) break;
        if (lote.quantidadeDisponivel <= 0) continue;
        const consumo = Math.min(lote.quantidadeDisponivel, restante);
        custoTotal += consumo * lote.custoUnitario;
        lote.quantidadeDisponivel -= consumo;
        restante -= consumo;
      }
      novoEstoque[idx].lotes = novoEstoque[idx].lotes.map(l => lotesOrdenados.find(lo => lo.id === l.id) || l);
    }
    itensResultado.push({ ...it, custoTotal, precoVendaTotal: it.precoVendaUnitario * it.quantidade });
  }

  const totalCusto = itensResultado.reduce((acc, i) => acc + i.custoTotal, 0);
  return { novoEstoque, itensResultado, totalCusto, erros };
}

function fileToCompressedDataUrl(file, maxWidth = 900, quality = 0.55) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
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

// Chave de um item dentro de uma venda (para saber o que já foi expedido)
function chaveItemVenda(vendaId, item) {
  return `${vendaId}:${item.id || item.unidadeId || `${item.itemId}-${item.descricao}`}`;
}

// Quantidade já recebida de uma linha de pedido de compra
function qtdRecebida(recebimentos, pedidoId, itemLineId) {
  return recebimentos.filter(r => r.pedidoId === pedidoId && r.itemLineId === itemLineId).reduce((a, r) => a + r.quantidade, 0);
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

  const [showBackup, setShowBackup] = useState(false);
  const [importando, setImportando] = useState(false);

  function exportarBackup() {
    const dados = {
      versao: 1, exportadoEm: new Date().toISOString(),
      estoque, clientes, fornecedores, vendas, orcamentos, expedicoes, pedidosCompra, recebimentos, depositos, transferencias,
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
      notify('Backup importado com sucesso');
      setShowBackup(false);
    } catch (e) {
      notify('Não foi possível ler esse arquivo de backup');
    }
    setImportando(false);
  }

  useEffect(() => {
    (async () => {
      const [e, c, f, v, or, ex, pc, rc, dp, tr] = await Promise.all([
        loadKey('sgm:estoque', []),
        loadKey('sgm:clientes', []),
        loadKey('sgm:fornecedores', []),
        loadKey('sgm:vendas', []),
        loadKey('sgm:orcamentos', []),
        loadKey('sgm:expedicoes', []),
        loadKey('sgm:pedidosCompra', []),
        loadKey('sgm:recebimentos', []),
        loadKey('sgm:depositos', []),
        loadKey('sgm:transferencias', []),
      ]);

      // Migração: garante que sempre existe ao menos um depósito, e que todo lote/unidade
      // já existente (de antes do controle por depósito) fique associado a ele.
      let depositosFinal = dp;
      let estoqueFinal = e;
      if (depositosFinal.length === 0) {
        depositosFinal = [{ id: uid(), nome: 'Depósito Principal', endereco: '', observacoes: '' }];
        await saveKey('sgm:depositos', depositosFinal);
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
      if (mudou) await saveKey('sgm:estoque', estoqueFinal);

      setEstoque(estoqueFinal); setClientes(c); setFornecedores(f); setVendas(v); setOrcamentos(or);
      setExpedicoes(ex); setPedidosCompra(pc); setRecebimentos(rc); setDepositos(depositosFinal); setTransferencias(tr);
      setLoading(false);
    })();
  }, []);

  function notify(msg) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  async function persist(key, setter, next) {
    setter(next);
    const ok = await saveKey(key, next);
    if (!ok) notify('⚠️ Não foi possível salvar. Verifique se este artifact foi publicado e se ainda há espaço de armazenamento.');
  }
  async function persistEstoque(next) { await persist('sgm:estoque', setEstoque, next); }
  async function persistClientes(next) { await persist('sgm:clientes', setClientes, next); }
  async function persistFornecedores(next) { await persist('sgm:fornecedores', setFornecedores, next); }
  async function persistVendas(next) { await persist('sgm:vendas', setVendas, next); }
  async function persistOrcamentos(next) { await persist('sgm:orcamentos', setOrcamentos, next); }
  async function persistExpedicoes(next) { await persist('sgm:expedicoes', setExpedicoes, next); }
  async function persistPedidosCompra(next) { await persist('sgm:pedidosCompra', setPedidosCompra, next); }
  async function persistRecebimentos(next) { await persist('sgm:recebimentos', setRecebimentos, next); }
  async function persistDepositos(next) { await persist('sgm:depositos', setDepositos, next); }
  async function persistTransferencias(next) { await persist('sgm:transferencias', setTransferencias, next); }

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
        {tab === 'estoque' && <EstoqueModule estoque={estoque} setEstoque={persistEstoque} depositos={depositos} askConfirm={askConfirm} notify={notify} />}
        {tab === 'depositos' && <DepositosModule depositos={depositos} setDepositos={persistDepositos} askConfirm={askConfirm} notify={notify} />}
        {tab === 'transferencias' && (
          <TransferenciasModule
            estoque={estoque} setEstoque={persistEstoque}
            depositos={depositos}
            transferencias={transferencias} setTransferencias={persistTransferencias}
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
            notify={notify}
          />
        )}
        {tab === 'recebimento' && (
          <RecebimentoModule
            pedidos={pedidosCompra} setPedidos={persistPedidosCompra}
            recebimentos={recebimentos} setRecebimentos={persistRecebimentos}
            estoque={estoque} setEstoque={persistEstoque}
            depositos={depositos}
            notify={notify}
          />
        )}
        {tab === 'clientes' && <ClientesModule clientes={clientes} setClientes={persistClientes} askConfirm={askConfirm} notify={notify} />}
        {tab === 'orcamentos' && (
          <OrcamentoModule
            orcamentos={orcamentos} setOrcamentos={persistOrcamentos}
            vendas={vendas} setVendas={persistVendas}
            clientes={clientes} estoque={estoque} setEstoque={persistEstoque} depositos={depositos} askConfirm={askConfirm} notify={notify}
          />
        )}
        {tab === 'vendas' && (
          <VendasModule vendas={vendas} setVendas={persistVendas} clientes={clientes} estoque={estoque} setEstoque={persistEstoque} depositos={depositos} orcamentos={orcamentos} setOrcamentos={persistOrcamentos} notify={notify} />
        )}
        {tab === 'expedicao' && (
          <ExpedicaoModule vendas={vendas} estoque={estoque} expedicoes={expedicoes} setExpedicoes={persistExpedicoes} notify={notify} />
        )}
        {tab === 'financeiro' && <FinanceiroModule vendas={vendas} estoque={estoque} pedidosCompra={pedidosCompra} />}
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

/* ---------------- CARRINHO (compartilhado por Vendas e Orçamentos) ---------------- */

function CarrinhoEditor({ estoque, depositos, carrinho, setCarrinho, notify }) {
  const [produtoSel, setProdutoSel] = useState('');
  const [depositoSel, setDepositoSel] = useState(depositos.length === 1 ? depositos[0].id : '');
  const [serialSel, setSerialSel] = useState('');
  const [qtdSel, setQtdSel] = useState(1);
  const [precoSel, setPrecoSel] = useState('');

  const produtoAtual = estoque.find(i => i.id === produtoSel);
  useEffect(() => { if (produtoAtual) setPrecoSel(produtoAtual.precoVenda); }, [produtoSel]);

  const depositosComEstoque = produtoAtual ? depositos.filter(d => availableQty(produtoAtual, d.id) > 0) : [];

  function addItem() {
    if (!produtoAtual || !depositoSel) return;
    const preco = parseFloat(precoSel) || 0;
    const depositoNome = depositos.find(d => d.id === depositoSel)?.nome || '';
    if (produtoAtual.serializado) {
      if (!serialSel) return;
      const unidade = produtoAtual.unidades.find(u => u.id === serialSel);
      setCarrinho(c => [...c, { id: uid(), itemId: produtoAtual.id, unidadeId: unidade.id, categoria: produtoAtual.categoria, descricao: `${produtoAtual.marca} ${produtoAtual.modelo}`, serial: unidade.serial, quantidade: 1, precoVendaUnitario: preco, depositoId: depositoSel, depositoNome }]);
      setSerialSel('');
    } else {
      const qtd = parseInt(qtdSel) || 1;
      if (qtd < 1 || qtd > availableQty(produtoAtual, depositoSel)) { notify('Quantidade indisponível nesse depósito'); return; }
      setCarrinho(c => [...c, { id: uid(), itemId: produtoAtual.id, categoria: produtoAtual.categoria, descricao: `${produtoAtual.marca} ${produtoAtual.modelo}`, quantidade: qtd, precoVendaUnitario: preco, depositoId: depositoSel, depositoNome }]);
      setQtdSel(1);
    }
    setProdutoSel(''); setDepositoSel(depositos.length === 1 ? depositos[0].id : '');
  }

  function removeItem(idx) { setCarrinho(c => c.filter((_, i) => i !== idx)); }
  const total = carrinho.reduce((acc, it) => acc + it.precoVendaUnitario * it.quantidade, 0);

  return (
    <>
      <div className="border border-dashed border-slate-200 rounded-md p-3 space-y-2">
        <p className="text-xs text-slate-500 font-medium">Adicionar produto do estoque</p>
        <select value={produtoSel} onChange={e => { setProdutoSel(e.target.value); setSerialSel(''); setDepositoSel(depositos.length === 1 ? depositos[0].id : ''); }} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm">
          <option value="">Selecione o produto...</option>
          {estoque.map(i => {
            const disp = availableQty(i);
            return <option key={i.id} value={i.id} disabled={disp === 0}>{i.categoria} · {i.marca} {i.modelo} ({disp} disp.)</option>;
          })}
        </select>
        {produtoAtual && depositos.length > 1 && (
          <select value={depositoSel} onChange={e => { setDepositoSel(e.target.value); setSerialSel(''); }} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm">
            <option value="">Selecione o depósito...</option>
            {depositosComEstoque.map(d => <option key={d.id} value={d.id}>{d.nome} ({availableQty(produtoAtual, d.id)} disp.)</option>)}
          </select>
        )}
        {produtoAtual && depositoSel && (
          <div className="flex flex-col sm:flex-row gap-2">
            {produtoAtual.serializado ? (
              <select value={serialSel} onChange={e => setSerialSel(e.target.value)} className="flex-1 border border-slate-200 rounded-md px-2 py-2 text-sm">
                <option value="">Número de série (mais antigo primeiro)...</option>
                {produtoAtual.unidades.filter(u => u.status === 'Disponível' && u.depositoId === depositoSel).sort((a, b) => new Date(a.dataEntrada) - new Date(b.dataEntrada)).map((u, idx) => (
                  <option key={u.id} value={u.id}>{u.serial}{idx === 0 ? ' (mais antigo)' : ''}</option>
                ))}
              </select>
            ) : (
              <input type="number" min={1} max={availableQty(produtoAtual, depositoSel)} value={qtdSel} onChange={e => setQtdSel(e.target.value)} placeholder="Qtd" className="sm:w-24 border border-slate-200 rounded-md px-2 py-2 text-sm" />
            )}
            <input type="number" step="0.01" value={precoSel} onChange={e => setPrecoSel(e.target.value)} placeholder="Preço de venda unit." className="sm:w-40 border border-slate-200 rounded-md px-2 py-2 text-sm" />
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

function EstoqueModule({ estoque, setEstoque, depositos, askConfirm, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(emptyForm());
  const [editandoPrecoId, setEditandoPrecoId] = useState(null);
  const [novoPreco, setNovoPreco] = useState('');

  function abrirEdicaoPreco(item) { setEditandoPrecoId(item.id); setNovoPreco(item.precoVenda); }
  function cancelarEdicaoPreco() { setEditandoPrecoId(null); setNovoPreco(''); }

  async function confirmarAtualizacaoPreco(item) {
    const valor = parseFloat(novoPreco);
    if (isNaN(valor) || valor < 0) { notify('Informe um preço válido'); return; }
    if (valor === item.precoVenda) { cancelarEdicaoPreco(); return; }
    const registro = { data: new Date().toISOString(), precoAnterior: item.precoVenda, precoNovo: valor };
    const next = estoque.map(i => i.id === item.id ? { ...i, precoVenda: valor, historicoPrecos: [registro, ...(i.historicoPrecos || [])] } : i);
    await setEstoque(next);
    notify(`Preço de venda atualizado: ${currency(item.precoVenda)} → ${currency(valor)}`);
    cancelarEdicaoPreco();
  }

  function emptyForm() {
    return { categoria: 'Inversor', marca: '', modelo: '', potencia: '', serializado: true, precoVenda: '', quantidadeMinima: '', observacoes: '' };
  }
  function resetForm() { setForm(emptyForm()); setShowForm(false); }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.marca || !form.modelo) { notify('Preencha marca e modelo antes de salvar'); return; }
    const novo = {
      id: uid(), categoria: form.categoria, marca: form.marca.trim(), modelo: form.modelo.trim(),
      potencia: form.potencia.trim(), serializado: form.serializado,
      precoVenda: parseFloat(form.precoVenda) || 0,
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
    if (!(await askConfirm(`Importar ${novos.length} produto(s) da planilha Atacado?${ignorados > 0 ? ` (${ignorados} já cadastrado(s) serão ignorados)` : ''}`))) return;
    const criados = novos.map(p => ({
      id: uid(), categoria: p.categoria, marca: p.marca, modelo: p.modelo, potencia: p.potencia,
      serializado: p.serializado, precoVenda: p.precoVenda, quantidadeMinima: p.quantidadeMinima,
      observacoes: p.observacoes, unidades: p.serializado ? [] : undefined, lotes: p.serializado ? undefined : [],
    }));
    await setEstoque([...criados, ...estoque]);
    notify(`${criados.length} produto(s) importado(s) do catálogo Atacado`);
  }

  const filtrado = useMemo(() => estoque.filter(i => {
    if (filtroCategoria !== 'Todos' && i.categoria !== filtroCategoria) return false;
    return `${i.marca} ${i.modelo} ${i.potencia}`.toLowerCase().includes(busca.toLowerCase());
  }), [estoque, filtroCategoria, busca]);

  const resumo = useMemo(() => {
    const totalItens = estoque.length;
    const inversoresDisponiveis = estoque.filter(i => i.categoria === 'Inversor').reduce((acc, i) => acc + availableQty(i), 0);
    const estoqueBaixo = estoque.filter(i => availableQty(i) <= (i.quantidadeMinima || 0)).length;
    return { totalItens, inversoresDisponiveis, estoqueBaixo };
  }, [estoque]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <StatCard label="Produtos cadastrados" value={resumo.totalItens} />
        <StatCard label="Inversores disponíveis" value={resumo.inversoresDisponiveis} highlight />
        <StatCard label="Estoque baixo" value={resumo.estoqueBaixo} warn={resumo.estoqueBaixo > 0} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por marca ou modelo..." className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
        <select value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm">
          <option>Todos</option>{CATEGORIAS.map(c => <option key={c}>{c}</option>)}
        </select>
        <button onClick={() => setShowForm(s => !s)} className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
          <Plus size={16} /> Novo produto
        </button>
        <button onClick={handleImportarCatalogo} className="flex items-center justify-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-sm px-3 py-2 rounded-md whitespace-nowrap">
          Importar Atacado
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">Cadastrar produto (sem estoque ainda)</h3>
            <button type="button" onClick={resetForm}><X size={16} className="text-slate-400" /></button>
          </div>
          <p className="text-xs text-slate-400 -mt-2">A entrada de quantidade e custo é feita via Pedidos de compra → Recebimento.</p>
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
            <input type="number" step="0.01" placeholder="Preço de venda (R$)" value={form.precoVenda} onChange={e => setForm(f => ({ ...f, precoVenda: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
            <input type="number" placeholder="Estoque mínimo (alerta)" value={form.quantidadeMinima} onChange={e => setForm(f => ({ ...f, quantidadeMinima: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
          </div>
          <input placeholder="Observações" value={form.observacoes} onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} className="w-full border border-slate-200 rounded-md px-2 py-2 text-sm" />
          <button type="button" onClick={handleAdd} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800">Salvar produto</button>
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
                    </div>
                    <p className="text-xs text-slate-400">{item.potencia} · venda {currency(item.precoVenda)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`text-xs ${disp <= (item.quantidadeMinima || 0) ? 'text-red-500 font-medium flex items-center gap-1' : 'text-slate-500'}`}>
                    {disp <= (item.quantidadeMinima || 0) && <AlertTriangle size={12} />}{disp} disp.
                  </span>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
                </div>
              </div>
              {expanded[item.id] && (
                <div className="border-t border-slate-100 px-3 py-2 bg-slate-50">
                  <div className="flex items-center justify-between bg-white border border-slate-200 rounded-md px-3 py-2 mb-2">
                    {editandoPrecoId === item.id ? (
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-xs text-slate-500 shrink-0">Novo preço de venda:</span>
                        <input type="number" step="0.01" autoFocus value={novoPreco} onChange={e => setNovoPreco(e.target.value)} className="border border-slate-200 rounded-md px-2 py-1 text-sm w-28" />
                        <button onClick={() => confirmarAtualizacaoPreco(item)} className="text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1 rounded-md">Salvar</button>
                        <button onClick={cancelarEdicaoPreco} className="text-xs text-slate-500 px-2 py-1">Cancelar</button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs text-slate-500">Preço de venda atual: <span className="font-medium text-slate-700">{currency(item.precoVenda)}</span></span>
                        <button onClick={() => abrirEdicaoPreco(item)} className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1 rounded-md"><Pencil size={11} /> Atualizar preço</button>
                      </>
                    )}
                  </div>
                  {(item.historicoPrecos || []).length > 0 && (
                    <div className="mb-2 text-xs">
                      <p className="text-slate-400 mb-1">Histórico de atualização de preço</p>
                      <div className="space-y-0.5">
                        {item.historicoPrecos.map((h, i) => (
                          <p key={i} className="text-slate-500">{formatDate(h.data)} — {currency(h.precoAnterior)} → <span className="font-medium">{currency(h.precoNovo)}</span></p>
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
                            <td className="py-1.5"><span className={`px-1.5 py-0.5 rounded text-[11px] ${u.status === 'Disponível' ? 'bg-emerald-100 text-emerald-700' : u.status === 'Vendido' ? 'bg-slate-200 text-slate-600' : 'bg-amber-100 text-amber-700'}`}>{u.status}</span></td>
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

function TransferenciasModule({ estoque, setEstoque, depositos, transferencias, setTransferencias, notify }) {
  const [origemId, setOrigemId] = useState('');
  const [destinoId, setDestinoId] = useState('');
  const [produtoId, setProdutoId] = useState('');
  const [unidadeId, setUnidadeId] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [enviando, setEnviando] = useState(false);

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
      registro = { id: uid(), data: agora, produtoId, descricao: `${produto.marca} ${produto.modelo}`, serial, quantidade: 1, origemId, origemNome: nomeOrigem, destinoId, destinoNome: nomeDestino };
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
      registro = { id: uid(), data: agora, produtoId, descricao: `${produto.marca} ${produto.modelo}`, serial: null, quantidade: qtd, origemId, origemNome: nomeOrigem, destinoId, destinoNome: nomeDestino };
    }

    await setEstoque(novoEstoque);
    await setTransferencias([registro, ...transferencias]);
    setEnviando(false);
    notify('Transferência registrada');
    resetSelecao();
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
            {produtosComEstoqueNaOrigem.map(p => <option key={p.id} value={p.id}>{p.categoria} · {p.marca} {p.modelo} ({availableQty(p, origemId)} disp.)</option>)}
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
      <div className="space-y-2">
        {transferencias.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhuma transferência registrada.</p>}
        {transferencias.map(t => (
          <div key={t.id} className="bg-white border border-slate-200 rounded-lg p-3 text-sm">
            <p className="font-medium">{t.descricao} {t.serial && <span className="text-xs font-mono text-slate-400">· SN {t.serial}</span>}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              {t.origemNome} <ArrowLeftRight size={11} /> {t.destinoNome} · {t.quantidade}x · {formatDate(t.data)}
            </p>
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
  function emptyForm() { return { nome: '', cnpj: '', telefone: '', email: '', contato: '', endereco: '', observacoes: '' }; }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.nome) { notify('Preencha a razão social antes de salvar'); return; }
    await setFornecedores([{ id: uid(), ...form }, ...fornecedores]);
    notify('Fornecedor cadastrado'); setForm(emptyForm()); setShowForm(false);
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
        <button onClick={() => setShowForm(s => !s)} className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
          <Plus size={16} /> Novo fornecedor
        </button>
      </div>
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">Novo fornecedor</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} className="text-slate-400" /></button>
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
          <button type="button" onClick={handleAdd} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800">Salvar fornecedor</button>
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
            <button onClick={() => handleDelete(f.id)}><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- PEDIDOS DE COMPRA (como um "orçamento" de compra, ainda sem estoque) ---------------- */

function PedidoCompraModule({ estoque, setEstoque, fornecedores, pedidos, setPedidos, recebimentos, askConfirm, notify }) {
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
    const custo = parseFloat(custoUnitario) || 0;
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
      descricao: modoNovoProduto ? `${novoProd.marca} ${novoProd.modelo}` : `${produtoExistente.marca} ${produtoExistente.modelo}`,
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
          precoVenda: parseFloat(linha.novoProduto.precoVenda) || 0, quantidadeMinima: parseInt(linha.novoProduto.quantidadeMinima) || 0,
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

  function statusPedido(p) {
    if (p.cancelado) return { label: 'Cancelado', style: 'bg-red-100 text-red-600' };
    const pendente = p.itens.some(it => it.quantidade - qtdRecebida(recebimentos, p.id, it.id) > 0);
    return pendente ? { label: 'Aguardando recebimento', style: 'bg-amber-100 text-amber-700' } : { label: 'Recebido', style: 'bg-emerald-100 text-emerald-700' };
  }

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
                {estoque.map(i => <option key={i.id} value={i.id}>{i.categoria} · {i.marca} {i.modelo}</option>)}
              </select>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <select value={novoProd.categoria} onChange={e => setNovoProd(p => ({ ...p, categoria: e.target.value, serializado: SERIALIZAVEL_PADRAO[e.target.value] }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm">
                  {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                </select>
                <input placeholder="Marca" value={novoProd.marca} onChange={e => setNovoProd(p => ({ ...p, marca: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
                <input placeholder="Modelo" value={novoProd.modelo} onChange={e => setNovoProd(p => ({ ...p, modelo: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
                <input placeholder="Potência" value={novoProd.potencia} onChange={e => setNovoProd(p => ({ ...p, potencia: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
                <input type="number" step="0.01" placeholder="Preço de venda (R$)" value={novoProd.precoVenda} onChange={e => setNovoProd(p => ({ ...p, precoVenda: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
                <input type="number" placeholder="Estoque mínimo" value={novoProd.quantidadeMinima} onChange={e => setNovoProd(p => ({ ...p, quantidadeMinima: e.target.value }))} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
                <label className="flex items-center gap-1.5 text-xs text-slate-600 col-span-2">
                  <input type="checkbox" checked={novoProd.serializado} onChange={e => setNovoProd(p => ({ ...p, serializado: e.target.checked }))} /> Controlar por número de série
                </label>
              </div>
            )}

            <p className="text-[11px] text-slate-400">O número de série de cada inversor será digitado depois, item por item, na etapa de Recebimento.</p>
            <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder="Quantidade" value={quantidade} onChange={e => setQuantidade(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
              <input type="number" step="0.01" placeholder="Custo unitário (R$)" value={custoUnitario} onChange={e => setCustoUnitario(e.target.value)} className="border border-slate-200 rounded-md px-2 py-2 text-sm" />
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
      <div className="space-y-2">
        {pedidos.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum pedido registrado.</p>}
        {pedidos.map(p => {
          const status = statusPedido(p);
          return (
            <div key={p.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
              <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpanded(x => ({ ...x, [p.id]: !x[p.id] }))}>
                <div className="flex items-center gap-2 min-w-0">
                  <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expanded[p.id] ? 'rotate-90' : ''}`} />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate flex items-center gap-1.5">{p.fornecedorNome} <span className={`text-[11px] px-1.5 py-0.5 rounded ${status.style}`}>{status.label}</span></p>
                    <p className="text-xs text-slate-400">Pedido {p.numeroPedidoFornecedor} {p.numeroNotaFiscal && `· NF ${p.numeroNotaFiscal}`} · {formatDate(p.data)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-medium text-sm">{currency(p.valorTotal)}</span>
                  {!p.cancelado && status.label !== 'Recebido' && (
                    <button onClick={(e) => { e.stopPropagation(); cancelarPedido(p.id); }}><Ban size={14} className="text-slate-300 hover:text-red-500" /></button>
                  )}
                </div>
              </div>
              {expanded[p.id] && (
                <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 space-y-1">
                  {p.itens.map((i, idx) => {
                    const recebido = qtdRecebida(recebimentos, p.id, i.id);
                    return <p key={idx} className="text-xs text-slate-600">{i.descricao} — {i.quantidade}x {currency(i.custoUnitario)} · recebido {recebido}/{i.quantidade}</p>;
                  })}
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

function RecebimentoModule({ pedidos, setPedidos, recebimentos, setRecebimentos, estoque, setEstoque, depositos, notify }) {
  const pedidosComPendencia = useMemo(() => {
    return pedidos
      .filter(p => !p.cancelado)
      .map(p => ({ ...p, itensPendentes: p.itens.map(it => ({ ...it, pendente: it.quantidade - qtdRecebida(recebimentos, p.id, it.id) })).filter(it => it.pendente > 0) }))
      .filter(p => p.itensPendentes.length > 0);
  }, [pedidos, recebimentos]);

  const pedidosConcluidos = useMemo(() => {
    return pedidos.filter(p => !p.cancelado && p.itens.every(it => it.quantidade - qtdRecebida(recebimentos, p.id, it.id) <= 0));
  }, [pedidos, recebimentos]);

  const [expandedPedido, setExpandedPedido] = useState({});
  const [formItem, setFormItem] = useState(null);
  const [expandedHistorico, setExpandedHistorico] = useState({});

  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">A entrada só pode ser feita a partir de um pedido de compra já cadastrado. Para cada inversor, tire uma foto da etiqueta e digite o número de série na hora — item por item — até completar a quantidade do pedido.</p>

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
                {p.itensPendentes.map(it => (
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
                ))}
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
                        <div key={r.id} className="flex items-center gap-2 mt-1 pl-2 border-l-2 border-emerald-200">
                          {r.serial && <span className="font-mono text-slate-500">SN {r.serial}</span>}
                          {!r.serial && <span className="text-slate-500">{r.quantidade} un.</span>}
                          {r.depositoNome && <span className="text-slate-400 flex items-center gap-0.5"><Warehouse size={10} /> {r.depositoNome}</span>}
                          <span className="text-slate-400">{formatDate(r.data)}</span>
                          {r.foto && <img src={r.foto} alt="Foto da entrada" className="w-10 h-10 object-cover rounded border border-slate-200" />}
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
    const registro = { id: uid(), pedidoId: pedido.id, itemLineId: item.id, descricao: item.descricao, serial: serial.trim(), quantidade: 1, foto, data: agora, depositoId, depositoNome };
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
    const registro = { id: uid(), pedidoId: pedido.id, itemLineId: item.id, descricao: item.descricao, serial: null, quantidade: qtd, foto, data: agora, depositoId, depositoNome };
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

/* ---------------- CLIENTES ---------------- */

function ClientesModule({ clientes, setClientes, askConfirm, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(emptyForm());
  function emptyForm() { return { nome: '', documento: '', telefone: '', email: '', endereco: '', cidade: '', uc: '', observacoes: '' }; }

  async function handleAdd(e) {
    e.preventDefault();
    if (!form.nome) { notify('Preencha o nome do cliente antes de salvar'); return; }
    await setClientes([{ id: uid(), ...form }, ...clientes]);
    notify('Cliente cadastrado'); setForm(emptyForm()); setShowForm(false);
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
        <button onClick={() => setShowForm(s => !s)} className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium text-sm px-3 py-2 rounded-md">
          <Plus size={16} /> Novo cliente
        </button>
      </div>
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-lg p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-sm">Novo cliente</h3>
            <button type="button" onClick={() => setShowForm(false)}><X size={16} className="text-slate-400" /></button>
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
          <button type="button" onClick={handleAdd} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-800">Salvar cliente</button>
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
            <button onClick={() => handleDelete(c.id)}><Trash2 size={14} className="text-slate-300 hover:text-red-500" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- ORÇAMENTOS (carrinho que não baixa estoque até ser convertido) ---------------- */

function OrcamentoModule({ orcamentos, setOrcamentos, vendas, setVendas, clientes, estoque, setEstoque, depositos, askConfirm, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [clienteId, setClienteId] = useState('');
  const [carrinho, setCarrinho] = useState([]);
  const [expanded, setExpanded] = useState({});

  function novoOrcamento() { setEditingId(null); setClienteId(''); setCarrinho([]); setShowForm(true); }
  function editarOrcamento(orc) { setEditingId(orc.id); setClienteId(orc.clienteId); setCarrinho(orc.itens.map(i => ({ ...i }))); setShowForm(true); }
  function cancelarForm() { setShowForm(false); setEditingId(null); setClienteId(''); setCarrinho([]); }

  const total = carrinho.reduce((acc, it) => acc + it.precoVendaUnitario * it.quantidade, 0);

  async function salvarOrcamento() {
    if (!clienteId || carrinho.length === 0) { notify('Selecione o cliente e adicione ao menos um item'); return; }
    const cliente = clientes.find(c => c.id === clienteId);
    if (editingId) {
      const next = orcamentos.map(o => o.id === editingId ? { ...o, clienteId, clienteNome: cliente?.nome || o.clienteNome, itens: carrinho, total } : o);
      await setOrcamentos(next);
      notify('Orçamento atualizado');
    } else {
      const novo = { id: uid(), clienteId, clienteNome: cliente?.nome || 'Cliente removido', data: new Date().toISOString(), itens: carrinho, total, status: 'Aberto', vendaId: null };
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

  async function converterEmVenda(orc) {
    if (!(await askConfirm(`Converter o orçamento de ${orc.clienteNome} (${currency(orc.total)}) em venda? Isso vai dar baixa no estoque.`))) return;
    const { novoEstoque, itensResultado, totalCusto, erros } = consumirEstoque(estoque, orc.itens);
    if (erros.length > 0) { notify(`Não foi possível converter: ${erros[0]}`); return; }
    await setEstoque(novoEstoque);
    const venda = { id: uid(), clienteId: orc.clienteId, clienteNome: orc.clienteNome, data: new Date().toISOString(), itens: itensResultado, totalVenda: orc.total, totalCusto, origemOrcamentoId: orc.id };
    await setVendas([venda, ...vendas]);
    await setOrcamentos(orcamentos.map(o => o.id === orc.id ? { ...o, status: 'Convertido', vendaId: venda.id } : o));
    notify('Orçamento convertido em venda e estoque atualizado');
  }

  function statusBadge(status) {
    const styles = { Aberto: 'bg-slate-100 text-slate-600', Convertido: 'bg-emerald-100 text-emerald-700', Cancelado: 'bg-red-100 text-red-600' };
    return <span className={`text-[11px] px-1.5 py-0.5 rounded ${styles[status]}`}>{status}</span>;
  }

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

          <button onClick={salvarOrcamento} disabled={!clienteId || carrinho.length === 0} className="w-full bg-amber-500 disabled:opacity-30 hover:bg-amber-600 text-slate-900 font-medium text-sm px-4 py-2 rounded-md">
            {editingId ? 'Salvar alterações' : 'Salvar orçamento'}
          </button>
        </div>
      )}

      <h3 className="text-sm font-medium text-slate-500 mb-2">Orçamentos</h3>
      <div className="space-y-2">
        {orcamentos.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhum orçamento criado.</p>}
        {orcamentos.map(o => (
          <div key={o.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpanded(x => ({ ...x, [o.id]: !x[o.id] }))}>
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expanded[o.id] ? 'rotate-90' : ''}`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate flex items-center gap-1.5">{o.clienteNome} {statusBadge(o.status)}</p>
                  <p className="text-xs text-slate-400">{formatDate(o.data)} · {o.itens.length} item(ns)</p>
                </div>
              </div>
              <span className="font-medium text-sm shrink-0">{currency(o.total)}</span>
            </div>
            {expanded[o.id] && (
              <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 space-y-2">
                <div className="space-y-1">
                  {o.itens.map((it, i) => (
                    <p key={i} className="text-xs text-slate-600">{it.descricao} {it.serial && <span className="font-mono text-slate-400">· SN {it.serial}</span>} — {it.quantidade}x {currency(it.precoVendaUnitario)}</p>
                  ))}
                </div>
                {o.status === 'Aberto' && (
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => editarOrcamento(o)} className="flex items-center gap-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 px-2.5 py-1.5 rounded-md"><Pencil size={12} /> Editar</button>
                    <button onClick={() => converterEmVenda(o)} className="flex items-center gap-1 text-xs bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-md"><ArrowRightCircle size={12} /> Converter em venda</button>
                    <button onClick={() => cancelarOrcamento(o.id)} className="flex items-center gap-1 text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1.5 rounded-md"><Ban size={12} /> Cancelar</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- VENDAS (com baixa FIFO de custo) ---------------- */

function VendasModule({ vendas, setVendas, clientes, estoque, setEstoque, depositos, orcamentos, setOrcamentos, notify }) {
  const [showForm, setShowForm] = useState(false);
  const [clienteId, setClienteId] = useState('');
  const [carrinho, setCarrinho] = useState([]);
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
    notify(`Itens do orçamento de ${orc.clienteNome} importados — confira antes de finalizar`);
  }

  function resetForm() { setCarrinho([]); setClienteId(''); setOrcamentoOrigemId(''); setShowForm(false); }

  async function finalizarVenda() {
    if (!clienteId || carrinho.length === 0) return;
    const cliente = clientes.find(c => c.id === clienteId);
    const { novoEstoque, itensResultado, totalCusto, erros } = consumirEstoque(estoque, carrinho);
    if (erros.length > 0) { notify(erros[0]); return; }
    await setEstoque(novoEstoque);
    const venda = { id: uid(), clienteId, clienteNome: cliente?.nome || 'Cliente removido', data: new Date().toISOString(), itens: itensResultado, totalVenda: total, totalCusto, origemOrcamentoId: orcamentoOrigemId || undefined };
    await setVendas([venda, ...vendas]);
    if (orcamentoOrigemId && setOrcamentos) {
      await setOrcamentos(orcamentos.map(o => o.id === orcamentoOrigemId ? { ...o, status: 'Convertido', vendaId: venda.id } : o));
    }
    notify('Venda registrada e estoque atualizado');
    resetForm();
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

          <button onClick={finalizarVenda} disabled={!clienteId || carrinho.length === 0} className="w-full bg-amber-500 disabled:opacity-30 hover:bg-amber-600 text-slate-900 font-medium text-sm px-4 py-2 rounded-md">
            Finalizar venda
          </button>
        </div>
      )}

      <h3 className="text-sm font-medium text-slate-500 mb-2">Histórico de vendas</h3>
      <div className="space-y-2">
        {vendas.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nenhuma venda registrada.</p>}
        {vendas.map(v => (
          <div key={v.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpanded(x => ({ ...x, [v.id]: !x[v.id] }))}>
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expanded[v.id] ? 'rotate-90' : ''}`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{v.clienteNome} {v.origemOrcamentoId && <span className="text-[11px] text-slate-400 font-normal">(via orçamento)</span>}</p>
                  <p className="text-xs text-slate-400">{formatDate(v.data)} · {v.itens.length} item(ns)</p>
                </div>
              </div>
              <span className="font-medium text-sm shrink-0">{currency(v.totalVenda)}</span>
            </div>
            {expanded[v.id] && (
              <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 space-y-1">
                {v.itens.map((it, i) => (
                  <p key={i} className="text-xs text-slate-600">{it.descricao} {it.serial && <span className="font-mono text-slate-400">· SN {it.serial}</span>} — {it.quantidade}x {currency(it.precoVendaUnitario)}</p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- EXPEDIÇÃO (confirmação de entrega com fotos e nº de série) ---------------- */

function ExpedicaoModule({ vendas, estoque, expedicoes, setExpedicoes, notify }) {
  const regFor = (chave, etapa) => expedicoes.find(ex => ex.chave === chave && ex.etapa === etapa);

  const itensClassificados = useMemo(() => {
    const aguardandoSaida = [];
    const emRota = [];
    const concluidos = [];
    for (const v of vendas) {
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
  }, [vendas, expedicoes]);

  function agruparPorVenda(lista) {
    const map = new Map();
    for (const entry of lista) {
      if (!map.has(entry.venda.id)) map.set(entry.venda.id, { venda: entry.venda, itens: [] });
      map.get(entry.venda.id).itens.push(entry);
    }
    return Array.from(map.values());
  }

  const gruposSaida = agruparPorVenda(itensClassificados.aguardandoSaida);
  const gruposRota = agruparPorVenda(itensClassificados.emRota);
  const gruposConcluidos = agruparPorVenda(itensClassificados.concluidos);

  const [expandedGrupo, setExpandedGrupo] = useState({});
  const [formAtivo, setFormAtivo] = useState(null); // { chave, etapa }

  return (
    <div>
      <p className="text-xs text-slate-400 mb-4">A expedição tem dupla verificação: primeiro a <strong>saída da empresa</strong>, depois a <strong>entrega ao cliente</strong> — cada etapa exige foto e, para inversores, confirmação do número de série. Só é possível expedir produtos que tiveram entrada e passaram pelo estoque.</p>

      <h3 className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-1.5"><TruckIcon size={14} /> Aguardando saída da empresa</h3>
      <div className="space-y-2 mb-6">
        {gruposSaida.length === 0 && <p className="text-sm text-slate-400 text-center py-8">Nada pendente de saída.</p>}
        {gruposSaida.map(g => (
          <div key={g.venda.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpandedGrupo(x => ({ ...x, [`s-${g.venda.id}`]: !x[`s-${g.venda.id}`] }))}>
              <div className="flex items-center gap-2 min-w-0">
                <ChevronRight size={16} className={`text-slate-400 transition-transform shrink-0 ${expandedGrupo[`s-${g.venda.id}`] ? 'rotate-90' : ''}`} />
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{g.venda.clienteNome}</p>
                  <p className="text-xs text-slate-400">{formatDate(g.venda.data)} · {g.itens.length} item(ns) pendente(s)</p>
                </div>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 shrink-0">Aguardando saída</span>
            </div>
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
                  <p className="font-medium text-sm truncate">{g.venda.clienteNome}</p>
                  <p className="text-xs text-slate-400">{formatDate(g.venda.data)} · {g.itens.length} item(ns) em rota</p>
                </div>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 shrink-0">Em rota</span>
            </div>
            {expandedGrupo[`r-${g.venda.id}`] && (
              <div className="border-t border-slate-100 divide-y divide-slate-100">
                {g.itens.map(({ item, chave, saida }) => (
                  <div key={chave} className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm">{item.descricao} {item.serial && <span className="text-xs font-mono text-slate-400">· SN {item.serial}</span>}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><CheckCircle2 size={11} className="text-emerald-500" /> Saída confirmada em {formatDate(saida.data)}</p>
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
                <p className="font-medium text-sm truncate">{g.venda.clienteNome}</p>
              </div>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 shrink-0">Entregue</span>
            </div>
            {expandedGrupo[`c-${g.venda.id}`] && (
              <div className="border-t border-slate-100 px-3 py-2 bg-slate-50 space-y-4">
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
                            {saida.fotos.map((f, i) => <img key={i} src={f} alt="Foto da saída" className="w-12 h-12 object-cover rounded border border-slate-200" />)}
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
                            {entrega.fotos.map((f, i) => <img key={i} src={f} alt="Foto da entrega" className="w-12 h-12 object-cover rounded border border-slate-200" />)}
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

function FinanceiroModule({ vendas, estoque, pedidosCompra }) {
  const [periodo, setPeriodo] = useState('mes');

  const vendasFiltradas = useMemo(() => {
    if (periodo === 'tudo') return vendas;
    const agora = new Date();
    const limite = new Date();
    if (periodo === '30dias') limite.setDate(agora.getDate() - 30);
    if (periodo === 'mes') { limite.setDate(1); limite.setHours(0, 0, 0, 0); }
    return vendas.filter(v => new Date(v.data) >= limite);
  }, [vendas, periodo]);

  const totais = useMemo(() => {
    const totalVenda = vendasFiltradas.reduce((acc, v) => acc + v.totalVenda, 0);
    const totalCusto = vendasFiltradas.reduce((acc, v) => acc + v.totalCusto, 0);
    return { totalVenda, totalCusto, margemContribuicao: totalVenda - totalCusto };
  }, [vendasFiltradas]);

  // Saldo de reposição: acumulado desde sempre, independente do filtro de período.
  // Cresce com o custo (CMV) de cada venda e é abatido pelo valor de cada pedido de compra realizado.
  const saldoReposicao = useMemo(() => {
    const cmvAcumulado = vendas.reduce((acc, v) => acc + v.totalCusto, 0);
    const pedidosAcumulado = (pedidosCompra || []).filter(p => !p.cancelado).reduce((acc, p) => acc + p.valorTotal, 0);
    return { cmvAcumulado, pedidosAcumulado, saldo: cmvAcumulado - pedidosAcumulado };
  }, [vendas, pedidosCompra]);

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
      <div className={`rounded-lg p-4 mb-5 border ${saldoReposicao.saldo > 0 ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
        <p className={`text-xs ${saldoReposicao.saldo > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>Saldo de reposição a manter em caixa (acumulado, todas as vendas menos todos os pedidos de compra)</p>
        <p className={`text-2xl font-semibold ${saldoReposicao.saldo > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>{currency(saldoReposicao.saldo)}</p>
        <div className="flex gap-4 mt-2 text-xs text-slate-500">
          <span>CMV acumulado: {currency(saldoReposicao.cmvAcumulado)}</span>
          <span>Pedidos de compra: {currency(saldoReposicao.pedidosAcumulado)}</span>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">{saldoReposicao.saldo > 0 ? 'Esse valor ainda precisa ser reservado no banco para repor o que já foi vendido.' : 'A reposição está em dia — os pedidos de compra já cobrem o custo do que foi vendido.'}</p>
      </div>

      <div className="flex gap-2 mb-4">
        {[['mes', 'Este mês'], ['30dias', 'Últimos 30 dias'], ['tudo', 'Tudo']].map(([v, l]) => (
          <button key={v} onClick={() => setPeriodo(v)} className={`text-xs px-3 py-1.5 rounded-full border ${periodo === v ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 text-slate-500'}`}>{l}</button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500">Total vendido no período</p>
          <p className="text-xl font-semibold">{currency(totais.totalVenda)}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-xs text-emerald-700">Margem de contribuição (zera todo mês)</p>
          <p className="text-xl font-semibold text-emerald-700">{currency(totais.margemContribuicao)}</p>
          <p className="text-[11px] text-emerald-600 mt-1">É o único valor disponível para pagamentos — o restante da margem fica reservado para reposição.</p>
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
            {pedidosCompra.filter(p => !p.cancelado).map(p => (
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
