import { Comprobante as Comprobante33 } from '../../cfdi33/comprobante';
import { Comprobante as Comprobante40 } from '../../cfdi40/comprobante';
import { SumasConceptos } from './sumas_conceptos';
import { AbstractElement } from '../abstract_element';

export class SumasConceptosWriter {
    private readonly comprobante: Comprobante33 | Comprobante40;
    private readonly sumas: SumasConceptos;
    private readonly precision: number;
    private readonly writeImpuestoBase: boolean;

    constructor(comprobante: AbstractElement, sumas: SumasConceptos, precision = 6) {
        if (comprobante instanceof Comprobante33) {
            this.writeImpuestoBase = false;
        } else if (comprobante instanceof Comprobante40) {
            this.writeImpuestoBase = true;
        } else {
            throw new Error('The argument $comprobante must be a Comprobante (CFDI 3.3 or CFDI 4.0) element');
        }
        this.comprobante = comprobante;
        this.sumas = sumas;
        this.precision = precision;
    }

    public put(): void {
        this.putComprobanteSumas();
        this.putImpuestosNode();
        this.putComplementoImpuestoLocalSumas();
    }

    private putComprobanteSumas(): void {
        this.comprobante.set('SubTotal', this.format(this.sumas.getSubTotal()));
        this.comprobante.set('Total', this.format(this.sumas.getTotal()));
        this.comprobante.set('Descuento', this.format(this.sumas.getDescuento()));
        if (!this.sumas.foundAnyConceptWithDiscount() && !this.valueGreaterThanZero(this.sumas.getDescuento())) {
            this.comprobante.unset('Descuento');
        }
    }

    private putImpuestosNode(): void {
        // obtain node reference
        const impuestos = this.comprobante.getImpuestos();
        // if there is nothing to write then remove the children and exit
        if (!this.sumas.hasTraslados() && !this.sumas.hasRetenciones()) {
            this.comprobante.children().remove(impuestos);
            return;
        }
        // clear previous values
        impuestos.clear();
        // add traslados when needed
        if (this.sumas.hasTraslados()) {
            impuestos.set('TotalImpuestosTrasladados', this.format(this.sumas.getImpuestosTrasladados()));
            impuestos.getTraslados().multiTraslado(...this.getImpuestosContents(this.sumas.getTraslados()));
        }
        // add retenciones when needed
        if (this.sumas.hasRetenciones()) {
            impuestos.set('TotalImpuestosRetenidos', this.format(this.sumas.getImpuestosRetenidos()));
            impuestos.getRetenciones().multiRetencion(...this.getImpuestosContents(this.sumas.getRetenciones()));
        }
    }

    private putComplementoImpuestoLocalSumas(): void {
        // obtain node reference to Complemento ImpuestoLocal
        const impLocal = this.comprobante.searchNode('cfdi:Complemento', 'implocal:ImpuestosLocales');
        if (!impLocal) return;
        if (!this.sumas.hasLocalesTraslados() && !this.sumas.hasLocalesRetenciones()) {
            const complemento = this.comprobante.getComplemento();
            complemento.children().remove(impLocal);
            if (complemento.count() === 0) {
                this.comprobante.children().remove(complemento);
            }
            return;
        }
        // add attributes to ImpLocal
        impLocal.set('TotaldeRetenciones', this.format(this.sumas.getLocalesImpuestosRetenidos()));
        impLocal.set('TotaldeTraslados', this.format(this.sumas.getLocalesImpuestosTrasladados()));
    }

    private getImpuestosContents(
        impuestos: Record<string, Record<string, string | number>>
    ): Record<string, string | number>[] {
        const returnList: Record<string, string | number>[] = [];
        Object.values(impuestos).forEach((impuesto) => {
            impuesto['Importe'] = this.format(Number(impuesto['Importe']));
            returnList.push(impuesto);
        });
        return returnList;
    }

    private valueGreaterThanZero(value: number): boolean {
        return Number(value.toFixed(this.precision)) > 0;
    }

    public format(num: number): string {
        // added current fixed to since in javascript
        // toFixed-function, the floating point number 5
        // does not belong to the upper half of an integer,
        // the given number is rounded down
        const toFixed = (number: number, decimals: number): string => {
            const base = 10 ** decimals;
            return (Math.round(number * base) / base).toFixed(decimals);
        };
        return toFixed(num, this.precision);
    }

    public getComprobante(): Comprobante33 | Comprobante40 {
        return this.comprobante;
    }

    public getSumasConceptos(): SumasConceptos {
        return this.sumas;
    }

    public getPrecision(): number {
        return this.precision;
    }

    public hasWriteImpuestosBase(): boolean {
        return this.writeImpuestoBase;
    }
}
