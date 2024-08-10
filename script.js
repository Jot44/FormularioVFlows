$(document).ready(function () {
    $('#cnpj').on('input', function () {
        var value = $(this).val();
        value = value.replace(/\D/g, '');
        value = value.substring(0, 14);
        if (value.length <= 14) {
            value = value.replace(/^(\d{2})(\d)/, "$1.$2");
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
            value = value.replace(/\.(\d{3})(\d)/, ".$1/$2");
            value = value.replace(/(\d{4})(\d)/, "$1-$2");
        }
        $(this).val(value);
    });

    $('#inscricao-estadual').on('input', function () {
        var value = $(this).val();
        value = value.replace(/\D/g, '');
        value = value.substring(0, 9);
        $(this).val(value);
    });

    $('#inscricao-municipal').on('input', function () {
        var value = $(this).val();
        value = value.replace(/\D/g, '');
        value = value.substring(0, 11);
        $(this).val(value);
    });

    $('#cep').on('input', function () {
        let cep = $(this).val().replace(/\D/g, '');
        if (cep.length > 8) cep = cep.slice(0, 8);
        $(this).val(cep);
    });

    $('#cep').on('blur', function () {
        var cep = $(this).val().replace(/\D/g, '');
        if (cep != "") {
            var validacep = /^[0-9]{8}$/;
            if (validacep.test(cep)) {
                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/", function (dados) {
                    if (!("erro" in dados)) {
                        $('#endereco').val(dados.logradouro);
                        $('#bairro').val(dados.bairro);
                        $('#municipio').val(dados.localidade);
                        $('#estado').val(dados.uf);
                    } else {
                        alert("CEP não encontrado.");
                    }
                });
            } else {
                alert("Formato de CEP inválido.");
            }
        }
    });

    $('#numero').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    $('#telefone').on('input', function () {
        var input = $(this).val().replace(/\D/g, '');
        if (input.length > 2) {
            input = '(' + input.substring(0, 2) + ') ' + input.substring(2);
        }
        if (input.length > 9) {
            input = input.substring(0, 10) + '-' + input.substring(10, 14);
        }
        $(this).val(input);
    });

    $('#limpar-dados').on('click', function () {
        $('.produto-1 input[type="text"]').val('');
        $('.produto-1 select').prop('selectedIndex', 0);
    });

    $('#limpar-dados2').on('click', function () {
        $('.produto-2 input[type="text"]').val('');
        $('.produto-2 select').prop('selectedIndex', 0);
    });

    $('#estoque, #valor-unitario, #estoque2, #valor-unitario2').on('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    var formatCurrency = function (value) {
        return 'R$ ' + parseFloat(value).toFixed(2).replace('.', ',');
    };

    var unformatCurrency = function (value) {
        return value.replace('R$ ', '').replace(',', '.');
    };

    $('#valor-unitario').on('blur', function () {
        var value = $(this).val();
        if (value) {
            $(this).val(formatCurrency(unformatCurrency(value)));
        }
    }).on('focus', function () {
        var value = $(this).val();
        if (value) {
            $(this).val(unformatCurrency(value));
        }
    });

    $('#valor-unitario2').on('blur', function () {
        var value = $(this).val();
        if (value) {
            $(this).val(formatCurrency(unformatCurrency(value)));
        }
    }).on('focus', function () {
        var value = $(this).val();
        if (value) {
            $(this).val(unformatCurrency(value));
        }
    });

    $('#estoque, #valor-unitario').on('input', function () {
        var quantidade = parseFloat($('#estoque').val()) || 0;
        var valorUnitario = parseFloat($('#valor-unitario').val()) || 0;
        var valorTotal = quantidade * valorUnitario;
        $('#valor-total').val('R$ ' + valorTotal.toFixed(2).replace('.', ','));
    });

    $('#estoque2, #valor-unitario2').on('input', function () {
        var quantidade = parseFloat($('#estoque2').val()) || 0;
        var valorUnitario = parseFloat($('#valor-unitario2').val()) || 0;
        var valorTotal = quantidade * valorUnitario;
        $('#valor-total2').val('R$ ' + valorTotal.toFixed(2).replace('.', ','));
    });

    $('#formulario-produtos').on('submit', function (e) {
        var produto1 = $('#complemento').val().trim();
        var produto2 = $('#produto').val().trim();
        if (produto1 === '' && produto2 === '') {
            alert('Por favor, inclua pelo menos um produto.');
            e.preventDefault();
        }
    });

    var documentosAnexados = {};

    $(document).ready(function () {
        if (sessionStorage.getItem('documentosAnexados')) {
            documentosAnexados = JSON.parse(sessionStorage.getItem('documentosAnexados'));
            for (var index in documentosAnexados) {
                if (documentosAnexados.hasOwnProperty(index)) {
                    $('.primeiro-anexo, .segundo-anexo').each(function () {
                        if ($(this).data('index') == index) {
                            $(this).find('.texto-anexo p').text(documentosAnexados[index].nome);
                        }
                    });
                }
            }
        }

        $('.incluir-anexo').on('click', function () {
            var inputFile = $('<input/>').attr('type', 'file');
            inputFile.on('change', function (event) {
                var file = event.target.files[0];
                if (file) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var index = 0;
                        if (documentosAnexados[1] == undefined) {
                            index = 1;
                        } else if (documentosAnexados[2] == undefined) {
                            index = 2;
                        } else {
                            index = prompt("Escolha um documento para ser substituído: (Informe o número 1 ou 2 ?)");
                            if (index != 1 && index != 2) {
                                alert("Número inválido");
                                return;
                            }
                        }

                        var blob = new Blob([e.target.result], { type: file.type });
                        var blobURL = URL.createObjectURL(blob);

                        documentosAnexados[index] = {
                            nome: file.name,
                            blob: blobURL,
                            tipo: file.type,
                            tamanho: file.size
                        };

                        sessionStorage.setItem('documentosAnexados', JSON.stringify(documentosAnexados));

                        $('.primeiro-anexo, .segundo-anexo').each(function () {
                            if ($(this).data('index') == index) {
                                $(this).find('.texto-anexo p').text(file.name);
                            }
                        });
                    };
                    reader.readAsArrayBuffer(file);
                }
            });
            inputFile.click();
        });

        $('.botao-excluir').on('click', function () {
            var index = $(this).closest('.primeiro-anexo, .segundo-anexo').data('index');
            if (documentosAnexados[index]) {
                delete documentosAnexados[index];
                sessionStorage.setItem('documentosAnexados', JSON.stringify(documentosAnexados));
                $(this).closest('.primeiro-anexo, .segundo-anexo').find('.texto-anexo p').text('Nenhum documento anexado');
                alert('Documento excluído com sucesso!');
            }
        });

        $('.botao-visualizar').on('click', function () {
            var index = $(this).closest('.primeiro-anexo, .segundo-anexo').data('index');
            if (documentosAnexados[index]) {
                var link = document.createElement('a');
                link.href = documentosAnexados[index].blob;
                link.download = documentosAnexados[index].nome;
                link.click();
            } else {
                alert('Nenhum documento anexado para visualizar!');
            }
        });
    });

    $('.salvar-fornecedor').on('click', function () {

        $('#loading').show();

        var fornecedor = {
            razaoSocial: $('#razao-social').val(),
            nomeFantasia: $('#nome-fantasia').val(),
            cnpj: $('#cnpj').val(),
            inscricaoEstadual: $('#inscricao-estadual').val(),
            inscricaoMunicipal: $('#inscricao-municipal').val(),
            nomeContato: $('#nome-contato').val(),
            telefoneContato: $('#telefone').val(),
            emailContato: $('#email').val(),
            produtos: [],
            anexos: []
        };

        var produto1 = {
            indice: 1,
            descricaoProduto: $('#produto1').val(),
            unidadeMedida: $('#unidade-medida').val(),
            qtdeEstoque: $('#estoque').val(),
            valorUnitario: $('#valor-unitario').val(),
            valorTotal: $('#valor-total').val()
        };
        fornecedor.produtos.push(produto1);

        var produto2 = {
            indice: 2,
            descricaoProduto: $('#produto2').val(),
            unidadeMedida: $('#unidade-medida2').val(),
            qtdeEstoque: $('#estoque2').val(),
            valorUnitario: $('#valor-unitario2').val(),
            valorTotal: $('#valor-total2').val()
        };
        fornecedor.produtos.push(produto2);

        $('.anexos .nome-borda > div').each(function (index) {
            var anexo = {
                indice: index + 1,
                nomeArquivo: $(this).find('.texto-anexo p').text(),
                blobArquivo: documentosAnexados[index + 1] ? documentosAnexados[index + 1].blob : null,
            };
            fornecedor.anexos.push(anexo);
        });

        var fornecedorString = JSON.stringify(fornecedor, null, 4);
        console.log(fornecedorString);

        setTimeout(function () {
            $('#loading').hide();
            alert('Dados enviados com sucesso!');
        }, 2000);
    });
})