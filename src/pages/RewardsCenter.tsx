import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Coins, 
  Gift, 
  Star, 
  Target, 
  Award, 
  Clock, 
  Zap,
  ShoppingBag,
  Medal
} from 'lucide-react';

const RewardsCenter = () => {
  const achievements = [
    { 
      id: 1, 
      title: 'Time Master', 
      description: 'Complete 100 time jumps', 
      progress: 87, 
      total: 100, 
      reward: '500 CC',
      rarity: 'Legendary'
    },
    { 
      id: 2, 
      title: 'System Explorer', 
      description: 'Visit all core systems', 
      progress: 12, 
      total: 15, 
      reward: '250 CC',
      rarity: 'Epic'
    },
    { 
      id: 3, 
      title: 'Protocol Specialist', 
      description: 'Master 10 protocols', 
      progress: 7, 
      total: 10, 
      reward: '300 CC',
      rarity: 'Rare'
    },
  ];

  const rewards = [
    { name: 'Avatar Skin: Quantum', cost: 1000, type: 'cosmetic', rarity: 'legendary' },
    { name: 'HexaDome Access', cost: 750, type: 'utility', rarity: 'epic' },
    { name: 'Time Boost (24h)', cost: 200, type: 'boost', rarity: 'common' },
    { name: 'Neural Enhancement', cost: 500, type: 'upgrade', rarity: 'rare' },
    { name: 'Exclusive Badge', cost: 300, type: 'cosmetic', rarity: 'uncommon' },
    { name: 'Protocol Unlock', cost: 400, type: 'utility', rarity: 'rare' },
  ];

  const recentRewards = [
    { item: 'Daily Login Bonus', amount: '+50 CC', time: '2h ago' },
    { item: 'Mission Complete', amount: '+150 CC', time: '4h ago' },
    { item: 'Achievement Unlock', amount: '+300 CC', time: '1d ago' },
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-500/20 text-yellow-400';
      case 'epic': return 'bg-purple-500/20 text-purple-400';
      case 'rare': return 'bg-blue-500/20 text-blue-400';
      case 'uncommon': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24 space-y-8">
      {/* Header */}
      <div 
        className="relative glass-card theme-shape p-8 overflow-hidden"
        style={{
          backgroundImage: `url(/lovable-uploads/adabf320-38a4-4352-92e9-7b4876630717.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'multiply'
        }}
      >
        <div className="absolute inset-0 bg-accent/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-4 neon-text">Rewards Center</h1>
              <p className="text-muted-foreground">
                Earn ChronoCoins and unlock exclusive rewards
              </p>
            </div>
            <div className="text-center mt-4 md:mt-0">
              <div className="text-4xl font-bold text-accent mb-2">₡ 2,847</div>
              <p className="text-muted-foreground">ChronoCoin Balance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Progress */}
      <Card className="glass-card border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-accent" />
            <span>Active Achievements</span>
          </CardTitle>
          <CardDescription>Track your progress and earn rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="p-4 rounded-lg bg-secondary/20 border border-accent/20">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1">{achievement.title}</h3>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  </div>
                  <Badge variant="secondary" className={getRarityColor(achievement.rarity.toLowerCase())}>
                    {achievement.rarity}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.total}</span>
                  </div>
                  <Progress value={(achievement.progress / achievement.total) * 100} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-accent">{achievement.reward}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round((achievement.progress / achievement.total) * 100)}% Complete
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reward Store */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-accent" />
                <span>Reward Store</span>
              </CardTitle>
              <CardDescription>Redeem your ChronoCoins for exclusive items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rewards.map((reward, index) => (
                  <div key={index} className="p-4 rounded-lg bg-secondary/20 border border-accent/20 hover:border-accent/40 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium">{reward.name}</h3>
                      <Badge variant="secondary" className={getRarityColor(reward.rarity)}>
                        {reward.rarity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-accent font-semibold">₡ {reward.cost}</span>
                      <Button size="sm" className="btn-neon">
                        <Coins className="w-4 h-4 mr-2" />
                        Redeem
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Bonus */}
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Gift className="w-5 h-5 text-accent" />
                <span>Daily Bonus</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold text-accent mb-2">₡ 50</div>
              <p className="text-sm text-muted-foreground mb-4">Available in 6h 23m</p>
              <Button className="w-full btn-glass" disabled>
                <Clock className="w-4 h-4 mr-2" />
                Claimed Today
              </Button>
            </CardContent>
          </Card>

          {/* Recent Earnings */}
          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-accent" />
                <span>Recent Earnings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRewards.map((reward, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{reward.item}</p>
                      <p className="text-xs text-muted-foreground">{reward.time}</p>
                    </div>
                    <span className="text-accent font-semibold">{reward.amount}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="glass-card border-accent/20 text-center">
          <CardContent className="pt-6">
            <Medal className="w-8 h-8 mx-auto mb-3 text-accent" />
            <div className="text-2xl font-bold text-accent mb-1">23</div>
            <p className="text-muted-foreground">Achievements</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-accent/20 text-center">
          <CardContent className="pt-6">
            <Coins className="w-8 h-8 mx-auto mb-3 text-accent" />
            <div className="text-2xl font-bold text-accent mb-1">12,456</div>
            <p className="text-muted-foreground">Total Earned</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-accent/20 text-center">
          <CardContent className="pt-6">
            <Target className="w-8 h-8 mx-auto mb-3 text-accent" />
            <div className="text-2xl font-bold text-accent mb-1">7</div>
            <p className="text-muted-foreground">Streak Days</p>
          </CardContent>
        </Card>
        <Card className="glass-card border-accent/20 text-center">
          <CardContent className="pt-6">
            <Award className="w-8 h-8 mx-auto mb-3 text-accent" />
            <div className="text-2xl font-bold text-accent mb-1">Elite</div>
            <p className="text-muted-foreground">Tier Status</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RewardsCenter;