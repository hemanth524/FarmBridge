#include<iostream>
#include<unordered_map>
#include<algorithm>
using namespace std;
int main(){
    int t;
    cin>>t;
    while(t--){
      int n,k;
      cin>>n>>k;
      int arr[n];
      unordered_map<int,int>mp;
      for(int i=0;i<n;i++){
        cin>>arr[i];
        mp[abs(arr[i])%k]++;
      }
      int ind=-1;
      for(int i=0;i<n;i++){
        int z=abs(arr[i])%k;
        if(mp[z]==1){
          ind=i;
          break;
        }
      }
      if(ind!=-1){
        cout<<"YES"<<endl;
        cout<<ind+1<<endl;
      }
      else cout<<"NO"<<endl;

      
    }
}