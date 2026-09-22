import type {
  AIEvaluationResult,
  IAIEvaluatorService,
} from '../../domain/repositories/i-ai-evaluator.service'
import type {
  ComplaintCategory,
  ComplaintPriority,
} from '../../domain/entities/complaint.entity'

export class MockAIEvaluatorService implements IAIEvaluatorService {
  async evaluateComplaint(
    title: string,
    description: string,
  ): Promise<AIEvaluationResult> {
    const text = `${title} ${description}`.toLowerCase()

    let category: ComplaintCategory = 'PELAYANAN_PUBLIK'
    let priority: ComplaintPriority = 'MEDIUM'

    if (text.includes('lampu') || text.includes('jalan') || text.includes('jembatan') || text.includes('aspal') || text.includes('tiang')) {
      category = 'INFRASTRUKTUR'
    } else if (text.includes('sampah') || text.includes('banjir') || text.includes('bau') || text.includes('saluran') || text.includes('got')) {
      category = 'KEBERSIHAN_LINGKUNGAN'
    } else if (text.includes('pencurian') || text.includes('ribut') || text.includes('mabuk') || text.includes('kehilangan')) {
      category = 'KEAMANAN_KETERTIBAN'
    } else if (text.includes('bansos') || text.includes('blt') || text.includes('bantuan')) {
      category = 'BANTUAN_SOSIAL'
    }

    if (text.includes('mati total') || text.includes('amblas') || text.includes('kebakaran') || text.includes('darurat') || text.includes('bahaya')) {
      priority = 'EMERGENCY'
    } else if (text.includes('mati') || text.includes('rusak berat') || text.includes('tiga hari') || text.includes('seminggu')) {
      priority = 'HIGH'
    } else if (text.includes('sedikit') || text.includes('saran') || text.includes('usul')) {
      priority = 'LOW'
    }

    return {
      category,
      priority,
      confidenceScore: 0.92,
      summary: `Laporan warga mengenai masalah ${category.toLowerCase().replace('_', ' ')} (${title}).`,
      recommendedAction: `Disposisikan ke koordinator seksi terkait untuk inspeksi fisik ke lokasi.`,
    }
  }
}
