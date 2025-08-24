
import { Layout } from '@/components/Layout/Layout';
import { ProfessionalCard, ProfessionalCardContent, ProfessionalCardHeader, ProfessionalCardTitle } from '@/components/ui/professional-card';
import { ModernStatsGrid } from '@/components/Home/ModernStatsGrid';
import { useApp } from '@/contexts/AppContext';
import { BarChart3, TrendingUp, Calendar, Award, Target, Clock, Brain } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const mockProgressData = [
  { name: 'Lun', sessions: 2, score: 85 },
  { name: 'Mar', sessions: 3, score: 78 },
  { name: 'Mer', sessions: 1, score: 92 },
  { name: 'Jeu', sessions: 4, score: 88 },
  { name: 'Ven', sessions: 2, score: 95 },
  { name: 'Sam', sessions: 3, score: 82 },
  { name: 'Dim', sessions: 1, score: 90 }
];

const mockSubjectData = [
  { name: 'Mathématiques', value: 35, color: '#3B82F6' },
  { name: 'Physique', value: 25, color: '#10B981' },
  { name: 'Chimie', value: 20, color: '#F59E0B' },
  { name: 'Histoire', value: 20, color: '#8B5CF6' }
];

const mockWeeklyData = [
  { day: 'L', minutes: 45 },
  { day: 'M', minutes: 60 },
  { day: 'M', minutes: 30 },
  { day: 'J', minutes: 75 },
  { day: 'V', minutes: 40 },
  { day: 'S', minutes: 55 },
  { day: 'D', minutes: 20 }
];

export default function Stats() {
  const { stats } = useApp();

  return (
    <Layout title="Statistiques" className="space-y-8">
      {/* Statistiques générales */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-primary" />
          <h2 className="text-2xl font-bold">Vue d'ensemble</h2>
        </div>
        <ModernStatsGrid stats={stats} />
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Progression hebdomadaire */}
        <ProfessionalCard>
          <ProfessionalCardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <ProfessionalCardTitle>Progression de la semaine</ProfessionalCardTitle>
            </div>
          </ProfessionalCardHeader>
          <ProfessionalCardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockProgressData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ProfessionalCardContent>
        </ProfessionalCard>

        {/* Temps d'étude par jour */}
        <ProfessionalCard>
          <ProfessionalCardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <ProfessionalCardTitle>Temps d'étude quotidien</ProfessionalCardTitle>
            </div>
          </ProfessionalCardHeader>
          <ProfessionalCardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px'
                  }}
                />
                <Bar 
                  dataKey="minutes" 
                  fill="hsl(var(--primary))"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ProfessionalCardContent>
        </ProfessionalCard>
      </div>

      {/* Répartition par matière et objectifs */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Répartition par matière */}
        <ProfessionalCard>
          <ProfessionalCardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <ProfessionalCardTitle>Répartition par matière</ProfessionalCardTitle>
            </div>
          </ProfessionalCardHeader>
          <ProfessionalCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={mockSubjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {mockSubjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-3">
                {mockSubjectData.map((subject, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{subject.name}</p>
                      <p className="text-xs text-muted-foreground">{subject.value}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ProfessionalCardContent>
        </ProfessionalCard>

        {/* Objectifs */}
        <ProfessionalCard>
          <ProfessionalCardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <ProfessionalCardTitle>Objectifs de la semaine</ProfessionalCardTitle>
            </div>
          </ProfessionalCardHeader>
          <ProfessionalCardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Sessions de révision</p>
                  <p className="text-sm text-muted-foreground">12/15</p>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full" style={{width: '80%'}}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Temps d'étude</p>
                  <p className="text-sm text-muted-foreground">4h30/6h</p>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">Score moyen</p>
                  <p className="text-sm text-muted-foreground">87%/90%</p>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div className="bg-gradient-to-r from-purple-500 to-violet-500 h-3 rounded-full" style={{width: '97%'}}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-200 dark:border-green-800">
              <Award className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                Excellent travail cette semaine ! 🎉
              </p>
            </div>
          </ProfessionalCardContent>
        </ProfessionalCard>
      </div>
    </Layout>
  );
}
