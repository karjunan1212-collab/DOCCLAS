import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService, ProcessingStep } from '../../services/document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-design-ai-agents-radial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './design-ai-agents-radial.component.html',
  styleUrls: ['./design-ai-agents-radial.component.css']
})
export class DesignAiAgentsRadialComponent implements OnInit, AfterViewInit, OnDestroy {
  steps: ProcessingStep[] = [];
  private subscription: Subscription = new Subscription();
  stepMessages: string[] = [];
  uploadedFile: File | null = null;
  uploadedFileName = '';
  activeAgentIndex = -1;
  isMultipleUpload = false;

  // Task status messages
  taskStatuses = [
    'Doc processed successfully',
    'Document size 0.5 MB, 60 pages, DPI: 250',
    'OCR Successfully Processed',
    'Document Classified As: Invoice, MR, iBills',
    'Document successfully downloaded'
  ];

  // Task header icons
  taskIcons = ['📤', '✅', '🔍', '📋', '⬇️'];

  agents = [
    { name: 'Upload Agent', icon: '📤', description: 'Document Ingestion' },
    { name: 'Validator Agent', icon: '✅', description: 'Validation & QA' },
    { name: 'OCR Agent', icon: '🔍', description: 'Text Extraction' },
    { name: 'Classification Agent', icon: '📋', description: 'Document Categorization' },
    { name: 'Download Agent', icon: '⬇️', description: 'Output Generation' }
  ];

  // connection line coords in SVG coordinate space (viewBox 0..600)
  connectionLines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];

  @ViewChild('connectionSvg', { read: ElementRef }) connectionSvgEl!: ElementRef;

  constructor(public documentService: DocumentService, private cdr: ChangeDetectorRef) {
    this._cdr = cdr;
  }

  ngAfterViewInit() {
    // compute initial connections after view renders and ensure stability
    setTimeout(() => this.ensureConnectionsStable(), 50);
    window.requestAnimationFrame(() => this.ensureConnectionsStable());

    // Observe container size/layout changes to recompute endpoints reliably
    try {
      const container = this.connectionSvgEl?.nativeElement?.parentElement as HTMLElement | null;
      if (container && (window as any).ResizeObserver) {
        const ro = new (window as any).ResizeObserver(() => {
          if (this.resizeDebounceTimer) clearTimeout(this.resizeDebounceTimer);
          this.resizeDebounceTimer = setTimeout(() => this.ensureConnectionsStable(), 80);
        });
        ro.observe(container);
        this.resizeObserver = ro;
      }
      // Also observe DOM mutations (class/style changes) that affect layout
      if (container && (window as any).MutationObserver) {
        const mo = new (window as any).MutationObserver(() => {
          if (this.mutationDebounceTimer) clearTimeout(this.mutationDebounceTimer);
          this.mutationDebounceTimer = setTimeout(() => this.ensureConnectionsStable(), 100);
        });
        mo.observe(container, { attributes: true, childList: true, subtree: true });
        this.mutationObserver = mo;
      }
      // Observe body-level mutations too (helps when global styles or classes toggle)
      try {
        if ((window as any).MutationObserver && document && document.body) {
          const moGlobal = new (window as any).MutationObserver(() => {
            if (this.mutationDebounceTimer) clearTimeout(this.mutationDebounceTimer);
            this.mutationDebounceTimer = setTimeout(() => this.ensureConnectionsStable(), 120);
          });
          moGlobal.observe(document.body, { attributes: true, childList: true, subtree: true });
          (this as any).mutationObserverGlobal = moGlobal;
        }
      } catch (e) {
        // ignore
      }
    } catch (e) {
      // ignore if ResizeObserver not available
    }

    // Ensure fonts/layout finished (helps when initial render differs with DevTools open)
    try {
      if ((document as any).fonts && (document as any).fonts.ready) {
        (document as any).fonts.ready.then(() => setTimeout(() => this.ensureConnectionsStable(), 60));
      }
    } catch (e) {
      // ignore
    }
  }

  ngOnInit() {
    this.subscription = this.documentService.steps$.subscribe(steps => {
      this.steps = steps;
    });
    // subscribe to per-step messages (API responses)
    this.subscription.add(
      this.documentService.stepMessages$.subscribe(msgs => {
        this.stepMessages = msgs || [];
        this._cdr.detectChanges();
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if (this.resizeObserver) {
      try { this.resizeObserver.disconnect(); } catch (e) { /* ignore */ }
      this.resizeObserver = undefined;
    }
    if (this.resizeDebounceTimer) {
      clearTimeout(this.resizeDebounceTimer);
      this.resizeDebounceTimer = undefined;
    }
    if (this.mutationObserver) {
      try { this.mutationObserver.disconnect(); } catch (e) { /* ignore */ }
      this.mutationObserver = undefined;
    }
    if (this.mutationDebounceTimer) {
      clearTimeout(this.mutationDebounceTimer);
      this.mutationDebounceTimer = undefined;
    }
    if ((this as any).mutationObserverGlobal) {
      try { (this as any).mutationObserverGlobal.disconnect(); } catch (e) { /* ignore */ }
      (this as any).mutationObserverGlobal = undefined;
    }
  }

  @HostListener('window:resize') onWindowResize() {
    this.ensureConnectionsStable();
  }

  @HostListener('window:scroll', ['$event']) onWindowScroll() {
    this.ensureConnectionsStable();
  }

  @HostListener('window:orientationchange') onOrientationChange() {
    this.ensureConnectionsStable();
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.uploadedFile = files[0];
      this.uploadedFileName = files[0].name;
      this.documentService.uploadDocument(files[0]);
    }
  }

  async executeNextStep(stepIndex: number) {
    const currentStep = this.steps[stepIndex];
    if (currentStep && !currentStep.isCompleted && !currentStep.isProcessing) {
      if (this.isStepAvailable(stepIndex)) {
        this.activeAgentIndex = stepIndex;
        await this.documentService.executeNextStep(stepIndex);
        this.activeAgentIndex = -1;
      }
    }
  }

  downloadDocument() {
    if (this.uploadedFile) {
      const url = window.URL.createObjectURL(this.uploadedFile);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.uploadedFileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  }

  async executeDownloadStep(stepIndex: number) {
    const currentStep = this.steps[stepIndex];
    if (currentStep && !currentStep.isCompleted && !currentStep.isProcessing) {
      if (this.isStepAvailable(stepIndex)) {
        this.activeAgentIndex = stepIndex;
        await this.documentService.executeNextStep(stepIndex);
        this.activeAgentIndex = -1;
        // Download file after processing completes
        setTimeout(() => {
          this.downloadDocument();
        }, 500);
      }
    }
  }

  isStepAvailable(stepIndex: number): boolean {
    for (let i = 0; i < stepIndex; i++) {
      if (!this.steps[i].isCompleted) {
        return false;
      }
    }
    return true;
  }

  trackByIndex(index: number): number {
    return index;
  }

  isAllCompleted(): boolean {
    return this.steps.every(s => s.isCompleted);
  }

  getCompletedCount(): number {
    return this.steps.filter(s => s.isCompleted).length;
  }

  resetProcess(): void {
    this.uploadedFileName = '';
    this.uploadedFile = null;
    window.location.reload();
  }

  getAgentForStep(stepIndex: number) {
    return this.agents[stepIndex % this.agents.length];
  }

  private updateConnections(): void {
    try {
      const svgEl = this.connectionSvgEl?.nativeElement as SVGSVGElement | undefined;
      if (!svgEl) return;

      // Use precise screen -> SVG coordinate conversion via CTM
      const svgRect = svgEl.getBoundingClientRect();
      const coreEl = svgEl.parentElement?.querySelector('.ai-core') as HTMLElement | null;
      if (!coreEl) return;
      const coreRect = coreEl.getBoundingClientRect();
      const coreCenterClient = {
        x: coreRect.left + coreRect.width / 2,
        y: coreRect.top + coreRect.height / 2
      };

      const svg = svgEl as SVGSVGElement;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const invCTM = ctm.inverse();
      const clientToSvg = (px: number, py: number) => {
        const pt = svg.createSVGPoint();
        pt.x = px;
        pt.y = py;
        const tr = pt.matrixTransform(invCTM);
        return { x: tr.x, y: tr.y };
      };

      const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
      const agentEls = svgEl.parentElement?.querySelectorAll('.agent-position') || [];
      agentEls.forEach((el: Element) => {
        const rect = (el as HTMLElement).getBoundingClientRect();
        const centerClient = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };

        // Compute intersection of line (coreCenterClient -> centerClient) with agent rect edges (client coords)
        const dx = centerClient.x - coreCenterClient.x;
        const dy = centerClient.y - coreCenterClient.y;

        let intersectClient: { x: number; y: number } | null = null;
        if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6) {
          intersectClient = centerClient;
        } else {
          const candidates: Array<{ x: number; y: number; t: number }> = [];
          const leftX = rect.left;
          const rightX = rect.right;
          const topY = rect.top;
          const bottomY = rect.bottom;

          if (Math.abs(dx) > 1e-6) {
            const tLeft = (leftX - coreCenterClient.x) / dx;
            if (tLeft > 0 && tLeft <= 1) {
              const yAtLeft = coreCenterClient.y + tLeft * dy;
              if (yAtLeft >= topY - 0.5 && yAtLeft <= bottomY + 0.5) {
                candidates.push({ x: leftX, y: yAtLeft, t: tLeft });
              }
            }
            const tRight = (rightX - coreCenterClient.x) / dx;
            if (tRight > 0 && tRight <= 1) {
              const yAtRight = coreCenterClient.y + tRight * dy;
              if (yAtRight >= topY - 0.5 && yAtRight <= bottomY + 0.5) {
                candidates.push({ x: rightX, y: yAtRight, t: tRight });
              }
            }
          }

          if (Math.abs(dy) > 1e-6) {
            const tTop = (topY - coreCenterClient.y) / dy;
            if (tTop > 0 && tTop <= 1) {
              const xAtTop = coreCenterClient.x + tTop * dx;
              if (xAtTop >= leftX - 0.5 && xAtTop <= rightX + 0.5) {
                candidates.push({ x: xAtTop, y: topY, t: tTop });
              }
            }
            const tBottom = (bottomY - coreCenterClient.y) / dy;
            if (tBottom > 0 && tBottom <= 1) {
              const xAtBottom = coreCenterClient.x + tBottom * dx;
              if (xAtBottom >= leftX - 0.5 && xAtBottom <= rightX + 0.5) {
                candidates.push({ x: xAtBottom, y: bottomY, t: tBottom });
              }
            }
          }

          if (candidates.length > 0) {
            candidates.sort((a, b) => b.t - a.t);
            intersectClient = { x: candidates[0].x, y: candidates[0].y };
          } else {
            intersectClient = centerClient;
          }
        }

        // convert client coords to SVG viewBox coords
        const coreSvg = clientToSvg(coreCenterClient.x, coreCenterClient.y);
        const endSvg = clientToSvg(intersectClient ? intersectClient.x : centerClient.x, intersectClient ? intersectClient.y : centerClient.y);

        lines.push({
          x1: Math.round(coreSvg.x),
          y1: Math.round(coreSvg.y),
          x2: Math.round(endSvg.x),
          y2: Math.round(endSvg.y)
        });
      });

      this.connectionLines = lines;
      this._cdr.detectChanges();
    } catch (e) {
      // silent
    }
  }

  /**
   * Recompute connections repeatedly until values stabilize or max attempts reached.
   */
  private ensureConnectionsStable(maxAttempts = 12, delay = 60, attempt = 0): void {
    const prev = JSON.stringify(this.connectionLines || []);
    // run a few rAFs to let layout settle before computing
    const rAFs = (count: number, cb: () => void) => {
      if (count <= 0) return cb();
      requestAnimationFrame(() => rAFs(count - 1, cb));
    };
    rAFs(3, () => {
      this.updateConnections();
      if (attempt >= maxAttempts) return;
      setTimeout(() => {
        const curr = JSON.stringify(this.connectionLines || []);
        if (curr !== prev) {
          // exponential backoff for next attempt
          const nextDelay = Math.min(400, delay * 1.5);
          this.ensureConnectionsStable(maxAttempts, nextDelay, attempt + 1);
        }
      }, delay);
    });
  }

  // internal ref assigned from constructor
  private _cdr!: ChangeDetectorRef;
  private resizeObserver?: ResizeObserver;
  private resizeDebounceTimer: any;
  private mutationObserver?: MutationObserver;
  private mutationDebounceTimer: any;
}
