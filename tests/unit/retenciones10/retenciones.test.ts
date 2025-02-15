import '../../matchers/to_element_has_child';
import {
    Addenda,
    Complemento,
    Emisor,
    ImpRetenidos,
    Periodo,
    Receptor,
    Retenciones,
    Totales,
} from '../../../src/retenciones10';
import { CNode } from '@nodecfdi/cfdiutils-common';

describe('Elements.Retenciones10.Retenciones', () => {
    let element: Retenciones;

    beforeEach(() => {
        element = new Retenciones();
    });

    test('get element name', () => {
        expect(element.name()).toBe('retenciones:Retenciones');
        expect(element.getElementName()).toBe('retenciones:Retenciones');
    });

    test('emisor', () => {
        expect(element).toElementHasChildSingle(Emisor);
    });

    test('receptor', () => {
        expect(element).toElementHasChildSingle(Receptor);
    });

    test('periodo', () => {
        expect(element).toElementHasChildSingle(Periodo);
    });

    test('totales', () => {
        expect(element).toElementHasChildSingle(Totales);
    });

    test('imp retenidos', () => {
        const first = element.addImpRetenidos({ uuid: 'FOO' });
        expect(first).toBeInstanceOf(ImpRetenidos);
        expect(first.attributes().get('uuid')).toBe('FOO');
        expect(element.getTotales().count()).toBe(1);
    });

    test('multi imp retenidos', () => {
        const self = element.multiImpRetenidos([{ uuid: 'FOO' }, { uuid: 'BAR' }]);
        expect(self).toBe(element);
        const parent = element.getTotales();
        expect(element.getTotales().count()).toBe(2);
        expect(parent.children().get(0).attributes().get('uuid')).toBe('FOO');
        expect(parent.children().get(1).attributes().get('uuid')).toBe('BAR');
    });

    test('get complemento', () => {
        expect(element.searchNode('retenciones:Complemento')).toBeUndefined();
        const child = element.getComplemento();
        expect(child).toBeInstanceOf(Complemento);
        expect(element.searchNode('retenciones:Complemento')).toBe(child);
    });

    test('add complemento', () => {
        expect(element.count()).toBe(0);

        const child = new CNode('first');
        const addReturn = element.addComplemento(child);
        expect(element.count()).toBe(1);
        expect(addReturn).toBe(element);
        expect(element.searchNode('retenciones:Complemento', 'first')).toBe(child);
    });

    test('get addenda', () => {
        expect(element.searchNode('retenciones:Addenda')).toBeUndefined();
        const child = element.getAddenda();
        expect(child).toBeInstanceOf(Addenda);
        expect(element.searchNode('retenciones:Addenda')).toBe(child);
    });

    test('add addenda', () => {
        expect(element.count()).toBe(0);

        const child = new CNode('first');
        const addReturn = element.addAddenda(child);
        expect(element.count()).toBe(1);
        expect(addReturn).toBe(element);
        expect(element.searchNode('retenciones:Addenda', 'first')).toBe(child);
    });

    test('has fixed attributes', () => {
        const namespace = 'http://www.sat.gob.mx/esquemas/retencionpago/1';
        expect(element.attributes().get('Version')).toBe('1.0');
        expect(element.attributes().get('xmlns:retenciones')).toBe(namespace);
        expect(element.attributes().get('xsi:schemaLocation')).toMatch(new RegExp(`^${namespace} http://?`));
        expect(element.attributes().get('xsi:schemaLocation')).not.toBeUndefined();
    });

    test('children order', () => {
        element.getAddenda();
        element.getComplemento();
        element.getTotales();
        element.getPeriodo();
        element.getReceptor();
        element.getEmisor();

        expect(element.children().get(0)).toBeInstanceOf(Emisor);
        expect(element.children().get(1)).toBeInstanceOf(Receptor);
        expect(element.children().get(2)).toBeInstanceOf(Periodo);
        expect(element.children().get(3)).toBeInstanceOf(Totales);
        expect(element.children().get(4)).toBeInstanceOf(Complemento);
        expect(element.children().get(5)).toBeInstanceOf(Addenda);
    });
});
