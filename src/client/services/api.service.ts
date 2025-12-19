/**
 * API Service: Fetch-Wrapper für Backend-Kommunikation
 * 100% Config-Driven - generische Entity-Operationen
 *
 * @lastModified 2025-12-16
 */

const API_BASE = '/api'

export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    limit: number
    offset: number
  }
}

export interface ApiError {
  error: {
    message: string
    code: string
    details?: string[]
  }
}

export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  orderDir?: 'ASC' | 'DESC'
  filters?: Record<string, string | number | boolean>
}

class ApiService {
  /**
   * Generische Fetch-Methode mit Error-Handling
   */
  private async fetch<T>(endpoint: string, options?: RequestInit, base = API_BASE): Promise<T> {
    const response = await fetch(`${base}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = (await response.json()) as ApiError
      throw new Error(errorData.error?.message || `HTTP ${response.status}`)
    }

    // DELETE returns 204 No Content
    if (response.status === 204) {
      return undefined as T
    }

    return response.json() as Promise<T>
  }

  // ==================== CONFIG ====================

  /**
   * Lädt App-Konfiguration
   */
  async getAppConfig<T>(): Promise<T> {
    return this.fetch<T>('/config/app')
  }

  /**
   * Lädt Navigation-Konfiguration
   */
  async getNavigationConfig<T>(): Promise<T> {
    return this.fetch<T>('/config/navigation')
  }

  async getCatalog<T>(catalogName: string): Promise<T> {
    return this.fetch<T>(`/catalog/${catalogName}`)
  }

  async getDashboardSummary<T>(): Promise<T> {
    return this.fetch<T>('/dashboard/summary')
  }

  async getMobileSnapshot<T>(): Promise<T> {
    return this.fetch<T>('/mobile/dashboard', undefined, '')
  }

  /**
   * Lädt Entity-Konfiguration
   */
  async getEntityConfig<T>(entityName: string): Promise<T> {
    return this.fetch<T>(`/config/entity/${entityName}`)
  }

  /**
   * Lädt Table-Konfiguration
   */
  async getTableConfig<T>(tableName: string): Promise<T> {
    return this.fetch<T>(`/config/table/${tableName}`)
  }

  /**
   * Lädt Form-Konfiguration
   */
  async getFormConfig<T>(formName: string): Promise<T> {
    return this.fetch<T>(`/config/form/${formName}`)
  }

  async getViewConfig<T>(viewName: string): Promise<T> {
    return this.fetch<T>(`/config/view/${viewName}`)
  }

  /**
   * Lädt Widths-Konfiguration (für Spaltenbreiten)
   */
  async getWidthsConfig(): Promise<Record<string, string>> {
    return this.fetch<Record<string, string>>('/config/widths')
  }

  /**
   * Lädt Button-Konfiguration (für Button-Styling)
   */
  async getButtonConfig(): Promise<Record<string, string>> {
    return this.fetch<Record<string, string>>('/config/buttons')
  }

  /**
   * Lädt globale Table-Styling Konfiguration (Zebrastreifen, Zeilenhöhen, etc.)
   */
  async getTableStyleConfig(): Promise<Record<string, unknown>> {
    return this.fetch<Record<string, unknown>>('/config/table')
  }

  /**
   * Lädt Table-Spacing Konfiguration (für Tabellen-Abstände)
   */
  async getTableSpacingConfig(): Promise<Record<string, string>> {
    return this.fetch<Record<string, string>>('/config/table/spacing')
  }

  // ==================== ENTITY CRUD ====================

  /**
   * Holt alle Einträge einer Entity
   */
  async getAll<T>(entityName: string, options?: QueryOptions): Promise<ApiResponse<T[]>> {
    const params = new URLSearchParams()

    if (options?.limit) params.set('limit', String(options.limit))
    if (options?.offset) params.set('offset', String(options.offset))
    if (options?.orderBy) params.set('orderBy', options.orderBy)
    if (options?.orderDir) params.set('orderDir', options.orderDir)

    if (options?.filters) {
      for (const [key, value] of Object.entries(options.filters)) {
        params.set(`filter[${key}]`, String(value))
      }
    }

    const queryString = params.toString()
    const endpoint = `/${entityName}${queryString ? `?${queryString}` : ''}`

    return this.fetch<ApiResponse<T[]>>(endpoint)
  }

  /**
   * Holt einen einzelnen Eintrag
   */
  async getById<T>(entityName: string, id: string): Promise<ApiResponse<T>> {
    return this.fetch<ApiResponse<T>>(`/${entityName}/${id}`)
  }

  /**
   * Erstellt einen neuen Eintrag
   */
  async create<T>(entityName: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return this.fetch<ApiResponse<T>>(`/${entityName}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * Aktualisiert einen Eintrag
   */
  async update<T>(entityName: string, id: string, data: Partial<T>): Promise<ApiResponse<T>> {
    return this.fetch<ApiResponse<T>>(`/${entityName}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * Löscht einen Eintrag
   */
  async delete(entityName: string, id: string): Promise<void> {
    await this.fetch<void>(`/${entityName}/${id}`, {
      method: 'DELETE',
    })
  }
}

export const apiService = new ApiService()
